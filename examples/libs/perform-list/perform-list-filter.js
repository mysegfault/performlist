/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.1.2 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define([ "raf.js/raf.min", "tweenjs/tween.min", "pubsub-js/pubsub", "js-dom-tools/js-dom-tools" ], function(raf, tweenjs, pubsub, jsDomTools) {
    "use strict";
    var console = jsDomTools.useDebug(false);
    var Filter = function() {
        var that = this;
        that._options = {
            maxFilterHeight: 23,
            filterWidth: 30,
            useAnimatedScrolling: false,
            end: ""
        };
        that._vars = {
            listElement: null,
            titleItems: [],
            titleElements: null,
            visibleFilterElements: null,
            isResizingId: 0,
            filterHeight: 0,
            filterElements: null,
            filterContainerElement: null,
            isManualScrolling: false,
            isBuildingOnScrollItems: true,
            indexesTopTitles: [],
            selectedFilterElement: null,
            isAndroid: false,
            isIOS: false,
            eventCallbacks: [],
            id: 0,
            isReady: false,
            pubsubTokens: [],
            iScrollInst: null,
            filterContainerElementTop: 0,
            end: ""
        };
    };
    Filter.prototype.init = function(options) {
        var that = this;
        that._vars.listElement = options.listElement;
        if (that._vars.listElement === null) {
            console.error("PerformFilter main list element is invalid", that._vars.listElement);
            return;
        }
        that._vars.id = options.id;
        if (that._vars.id.length === 0) {
            console.error("PerformFilter main list ID is invalid", that._vars.id);
            return;
        }
        that._vars.isAndroid = navigator.userAgent.match(/Android/i) !== null;
        that._vars.isIOS = window.navigator.userAgent.match(/OS .+_.* like/) !== null;
        that._vars.pubsubTokens.push(pubsub.subscribe("mbs.performlist.initialized." + that._vars.id, function() {
            that.initialized();
        }));
        that._vars.pubsubTokens.push(pubsub.subscribe("mbs.performlist.ready." + that._vars.id, function() {
            that.ready();
        }));
        that._vars.pubsubTokens.push(pubsub.subscribe("mbs.performlist.start." + that._vars.id, function() {
            that.start();
        }));
        that._vars.pubsubTokens.push(pubsub.subscribe("mbs.performlist.stop." + that._vars.id, function() {
            that.stop();
        }));
        that._vars.pubsubTokens.push(pubsub.subscribe("mbs.performlist.resize." + that._vars.id, function() {
            that.resize();
        }));
    };
    Filter.prototype.initialized = function() {};
    Filter.prototype.ready = function() {
        var that = this;
        var scrollerElement = that._vars.listElement.querySelector(".perform-list-scroller");
        if (scrollerElement === null) {
            console.error("scrollerElement could not be found", scrollerElement);
            return;
        }
        that._addListSpaceForFilterElement();
        that._buildFilterContainerElement();
        that._vars.isReady = true;
    };
    Filter.prototype.start = function() {
        var that = this;
        try {
            that._vars.iScrollInst = $(that._vars.listElement).data("iscroll");
            if (typeof that._vars.iScrollInst === "undefined") {
                that._vars.iScrollInst = null;
            }
        } catch (e) {
            that._vars.iScrollInst = null;
        }
        that._startListenersOnFilterContainerElement();
        that.resize();
        that._vars.filterContainerElementTop = jsDomTools.getOffsetSum(that._vars.filterContainerElement).top;
    };
    Filter.prototype.stop = function() {};
    Filter.prototype.destroy = function() {
        var that = this;
        for (var i = 0; i < that._vars.pubsubTokens.length; i++) {
            var token = that._vars.pubsubTokens[i];
            pubsub.unsubscribe(token);
        }
    };
    Filter.prototype.createTitleHTML = function(title) {
        if (typeof title !== "string") {
            console.error("Invalid content");
            return "";
        }
        var html = '<span data-letter="' + title[0].toLowerCase() + '">' + title + "</span>";
        return html;
    };
    Filter.prototype.addTitleItem = function(title) {
        var that = this;
        that._vars.titleItems.push(title);
    };
    Filter.prototype._buildFilterContainerElement = function() {
        var that = this;
        if (that._vars.titleItems.length === 0) {
            console.error("PerformList Filter could not find any title");
            return;
        }
        function createFilterContainerElement() {
            var _element = document.createElement("div");
            _element.classList.add("perform-list-filters");
            _element.classList.add("perform-list");
            var html = "";
            for (var i = 0; i < that._vars.titleItems.length; i++) {
                var index = that._vars.titleItems[i];
                html += '<button class="perform-list-filters-button" data-letter="' + index[0].toLowerCase() + '">' + index[0].toUpperCase() + "</button>";
            }
            _element.innerHTML = html;
            _element.classList.add("cursor-pointer");
            return _element;
        }
        that._vars.filterContainerElement = createFilterContainerElement();
        require([ "perform-list/perform-list-prevent-page-scroll" ], function(preventPageScroller) {
            preventPageScroller.preventScrollingOnThis(that._vars.filterContainerElement);
        });
    };
    Filter.prototype._startListenersOnFilterContainerElement = function() {
        var that = this;
        if (that._vars.filterContainerElement === null) {
            console.error("PerformList Filter could not find index container element");
            return;
        }
        function _onTouchStart(event) {
            if (that._vars.isAndroid === true) {
                event.preventDefault();
            }
            if (that._vars.iScrollInst === null) {
                if (that._vars.listElement.getAttribute("is-scrolling") !== null) {
                    that._vars.listElement.style.overflowY = "hidden";
                    window.setTimeout(function() {
                        that._vars.listElement.style.overflowY = "scroll";
                    }, 0);
                }
            }
        }
        function _onTouchMove(event) {
            if (event.target.nodeName.toLowerCase() !== "button") {
                return;
            }
            var _selectedFilterElement = that._getCurrentItem(event);
            if (_selectedFilterElement !== null) {
                that._onNewSelectedFilter(_selectedFilterElement, event.type === "touchend");
            }
        }
        that._vars.eventCallbacks.touchstart = {
            parent: that._vars.filterContainerElement,
            callback: _onTouchStart
        };
        that._vars.filterContainerElement.addEventListener("touchstart", _onTouchStart, false);
        that._vars.eventCallbacks.touchmove = {
            parent: that._vars.filterContainerElement,
            callback: _onTouchMove
        };
        that._vars.filterContainerElement.addEventListener("touchmove", _onTouchMove, false);
        that._vars.eventCallbacks.touchend = {
            parent: that._vars.filterContainerElement,
            callback: _onTouchMove
        };
        that._vars.filterContainerElement.addEventListener("touchend", _onTouchMove, false);
        that._vars.eventCallbacks.click = {
            parent: that._vars.filterContainerElement,
            callback: _onTouchMove
        };
        that._vars.filterContainerElement.addEventListener("click", _onTouchMove, false);
    };
    Filter.prototype._stopListenersOnFilterContainerElement = function() {
        var that = this;
        for (var event in that._vars.eventCallbacks) {
            if (that._vars.eventCallbacks.hasOwnProperty(event) === false) {
                continue;
            }
            var details = that._vars.eventCallbacks[event];
            details.parent.removeEventListener(event, details.callback, false);
        }
    };
    Filter.prototype.setTitleElements = function(titleElements) {
        var that = this;
        that._vars.titleElements = titleElements;
    };
    Filter.prototype._addListSpaceForFilterElement = function() {
        var that = this;
        if (that._vars.listElement === null) {
            console.error("Could not find listElement", that._vars.listElement);
            return;
        }
        that._vars.listElement.style.marginRight = that._options.filterWidth + "px";
    };
    Filter.prototype._insertFilterContainerElement = function() {
        var that = this;
        var parentNode = that._vars.listElement.parentNode;
        if (parentNode.querySelector(".perform-list-filters") === null) {
            that._vars.filterContainerElement.style.opacity = 0;
            parentNode.insertBefore(that._vars.filterContainerElement, that._vars.listElement);
            that._vars.filterContainerElement.style.width = that._options.filterWidth + "px";
        }
    };
    Filter.prototype._updateFiltersList = function() {
        var that = this;
        function showOnlyNeededTitles(size) {
            var _visibleItems = [];
            var _titleElements = that._vars.filterContainerElement.querySelectorAll(".perform-list-filters-button");
            var _betweenNeedSize = size - 2 + 1;
            var _betweenTotalSize = _titleElements.length - 2;
            var _betweenSizeModulo = _betweenTotalSize / _betweenNeedSize;
            var _validIndexes = [];
            _validIndexes.push(0);
            for (var i = 0; i < _betweenNeedSize - 1; i++) {
                _validIndexes.push(Math.ceil(_betweenSizeModulo * (i + 1)));
            }
            if (size > 1) {
                _validIndexes.push(_titleElements.length - 1);
            }
            for (var j = 0; j < _titleElements.length; j++) {
                var _titleElement = _titleElements[j];
                if (_validIndexes.indexOf(j) !== -1) {
                    _titleElement.classList.remove("hidden");
                    _visibleItems.push(_titleElement);
                } else {
                    _titleElement.classList.add("hidden");
                }
            }
            return _visibleItems;
        }
        var cs = window.getComputedStyle(that._vars.listElement, null);
        var _coords = {
            height: 0,
            lineHeight: 0,
            end: ""
        };
        _coords.height = cs.height.replace("px", "");
        _coords.lineHeight = _coords.height / that._vars.titleItems.length;
        if (_coords.lineHeight < that._options.maxFilterHeight) {
            _coords.lineHeight = that._options.maxFilterHeight;
        }
        var _printedItemSize = parseInt(_coords.height / _coords.lineHeight);
        _coords.lineHeight = _coords.height / _printedItemSize;
        that._vars.filterHeight = _coords.lineHeight;
        that._vars.visibleFilterElements = showOnlyNeededTitles(_printedItemSize);
        for (var i = 0; i < that._vars.visibleFilterElements.length; i++) {
            var _titleElement = that._vars.visibleFilterElements[i];
            _titleElement.style.height = that._vars.filterHeight + "px";
        }
        that._vars.filterContainerElement.style.height = _coords.height + "px";
        if (that._vars.iScrollInst === null) {
            that._getIndexesTopTitles();
        }
    };
    Filter.prototype.resize = function() {
        var that = this;
        if (that._vars.isReady === false) {
            console.error("Not ready yet.");
            return;
        }
        that._vars.filterContainerElement.style.transition = "";
        that._vars.filterContainerElement.style.opacity = 0;
        that._updateFiltersList();
        that._insertFilterContainerElement();
        that._vars.filterContainerElement.style.transition = "opacity .7s ease";
        window.setTimeout(function() {
            that._vars.filterContainerElement.style.opacity = 1;
        }, 0);
    };
    Filter.prototype._goToListTitle = function(letter, forceAnimation) {
        var that = this;
        if (typeof letter !== "string") {
            console.error("Selected letter is invalid");
            return false;
        }
        forceAnimation = forceAnimation === true;
        var _titleElement = that._vars.listElement.querySelector('[data-letter="' + letter + '"]');
        if (_titleElement === null) {
            console.error("Selected filter is invalid");
            return false;
        }
        if (that._vars.iScrollInst !== null) {
            that._vars.iScrollInst.scrollToElement(_titleElement, 0);
            that._vars.iScrollInst.scrollTo(0, -6, 0, true);
        } else {
            var _to = jsDomTools.getOffsetSum(_titleElement).top - that._vars.filterContainerElementTop - 3;
            if (_to <= 0) {
                _to = 1;
            }
            if (that._options.useAnimatedScrolling === true && forceAnimation === true) {
                var _from = that._vars.listElement.scrollTop;
                that._vars.isManualScrolling = true;
                new TWEEN.Tween({
                    x: _from,
                    y: 0
                }).to({
                    x: _to
                }, 500).easing(TWEEN.Easing.Circular.InOut).onUpdate(function() {
                    that._vars.listElement.scrollTop = this.x;
                }).onComplete(function() {
                    that._vars.isManualScrolling = false;
                }).start();
                var _animate = function() {
                    requestAnimationFrame(_animate);
                    TWEEN.update();
                };
                _animate();
            } else {
                that._vars.listElement.scrollTop = _to;
                that._vars.isManualScrolling = false;
            }
        }
    };
    Filter.prototype._hoverFilter = function(selectedFilterElement) {
        var that = this;
        if (typeof selectedFilterElement === "undefined" || selectedFilterElement === null) {
            console.error("Invalid parameter");
            return false;
        }
        if (selectedFilterElement === that._vars.selectedFilterElement) {
            return;
        }
        that._vars.selectedFilterElement = selectedFilterElement;
        for (var j = 0; j < that._vars.filterElements.length; j++) {
            that._vars.filterElements[j].classList.remove("hover");
        }
        selectedFilterElement.classList.add("hover");
    };
    Filter.prototype._getIndexesTopTitles = function() {
        var that = this;
        if (that._vars.titleElements === null) {
            console.error("not yet");
            return;
        }
        var _cpt = 0;
        that._vars.indexesTopTitles = [];
        that._vars.isBuildingOnScrollItems = true;
        for (var i = 0; i < that._vars.titleElements.length; i++) {
            var titleElement = that._vars.titleElements[i];
            var currentLetter = titleElement.getAttribute("data-letter");
            if (currentLetter === null) {
                console.error("Invalid filter");
                continue;
            }
            var offset = titleElement.offsetTop;
            if (typeof titleElement.offsetParent === "object" && typeof titleElement.offsetParent.offsetTop === "number") {
                offset = titleElement.offsetParent.offsetTop;
            }
            while (_cpt <= offset) {
                that._vars.indexesTopTitles[_cpt] = i === 0 ? 0 : i - 1;
                _cpt++;
            }
        }
        that._vars.isBuildingOnScrollItems = false;
    };
    Filter.prototype._onListScroll = function(event) {
        var that = this;
        if (that._vars.isReady === false) {
            console.error("Not ready yet.");
            return;
        }
        if (that._vars.isManualScrolling === true) {
            return;
        }
        if (that._vars.isBuildingOnScrollItems === true) {
            return;
        }
        var scrollTop;
        if (typeof event.target._scrollTop !== "undefined") {
            scrollTop = event.target._scrollTop + 4;
        } else {
            scrollTop = event.target.scrollTop + 4;
        }
        var idx;
        if (scrollTop >= that._vars.indexesTopTitles.length) {
            idx = that._vars.titleElements.length - 1;
        } else {
            idx = that._vars.indexesTopTitles[scrollTop];
        }
        that._hoverFilter(that._vars.filterElements[idx]);
    };
    Filter.prototype._getCurrentItem = function(event) {
        var that = this;
        var _selectedFilterElement = null;
        var ref = null;
        if (typeof event.touches !== "undefined" && event.touches.length > 0) {
            ref = event.touches[0].pageY - that._vars.filterContainerElementTop;
        } else if (typeof event.changedTouches !== "undefined" && event.changedTouches.length > 0) {
            ref = event.changedTouches[0].pageY - that._vars.filterContainerElementTop;
        }
        if (ref !== null) {
            var _lastSelectedIndex = parseInt(ref / that._vars.filterHeight);
            if (_lastSelectedIndex < 0) {
                _lastSelectedIndex = 0;
            }
            if (_lastSelectedIndex >= that._vars.visibleFilterElements.length) {
                _lastSelectedIndex = that._vars.visibleFilterElements.length - 1;
            }
            _selectedFilterElement = that._vars.visibleFilterElements[_lastSelectedIndex];
        } else {
            if (event.target.classList.contains("perform-list-filters-button") === true) {
                _selectedFilterElement = event.target;
            }
        }
        return _selectedFilterElement;
    };
    Filter.prototype._onNewSelectedFilter = function(selectedFilterElement, forceAnimation) {
        var that = this;
        if (typeof selectedFilterElement === "undefined" || selectedFilterElement === null) {
            console.error("Invalid parameter selectedFilterElement: ", selectedFilterElement);
            return false;
        }
        forceAnimation = forceAnimation === true;
        var _selectedLetter = selectedFilterElement.getAttribute("data-letter");
        if (_selectedLetter !== null) {
            that._goToListTitle(_selectedLetter, forceAnimation);
        }
    };
    return Filter;
});