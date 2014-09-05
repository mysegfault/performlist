define(['html5-mobile-boilerplate/helper', 'pubsub-js/pubsub', 'js-dom-tools/js-dom-tools'], function(helper, pubsub, jsDomTools) {
	'use strict';

	var Performlist = function() {
		var that = this;

		that._options = {
			cssPrefix: 'perform-list',
			listContainer: 'container',
			listContainerElement: null,
			listContainerParent: 'container-parent',
			listScrollerElement: null,
			listScroller: 'scroller',
			listScrollerExtraClass: '',
			dependsOnUlLi: false,
			categoryType: 'ul',
			titleType: 'li',
			categoryTitleExtraClass: '',
			categoryItemExtraClass: '',
			itemType: 'li',
			useOptimizer: false,
			useFilters: true,
			usePreventPageScroller: false,
			autoStartAfterReady: true,
			minItemsForFilters: 0
		};

		that._vars = {
			scrollingStatusId: 0,
			optimizer: null,
			filterBuilder: null,
			filter: null,
			preventPageScroller: null,
			listItems: [],
			itemsType: '',
			listElement: null,
			scrollerElement: null,
			pluginsToLoad: [],
			isIOS: false,
			isAndroid: false,
			isAndroidStockBrowser: false,
			id: 0,
			fastButtonListInst: null,
			iScrollInst: null,
			isStarted: false
		};
	};

	/*
	 * Init is the first method to run. It can accept configuration for the
	 * list. It will send an asychronious 'initialized' event when done.
	 * 
	 * @param {object} options : contains options variables that overwrites 
	 * the default _options variables
	 * @returns {null}
	 */
	Performlist.prototype.init = function(options) {
		var that = this;

		that._vars.isIOS = (window.navigator.userAgent.match(/OS .+_.* like/) !== null);
		that._vars.isAndroid = (window.navigator.userAgent.match(/Android/) !== null);
		that._vars.isAndroidStockBrowser = (window.navigator.userAgent.match(/ Version\//) !== null);
		that._options.usePreventPageScroller = (that._vars.isIOS === true);

		if (typeof options === 'object') {
			for (var i in options) {
				if (typeof that._options[i] === 'undefined') {
					console.error('This option does not exist.', i);
					continue;
				}
				if (options[i] === null) {
					console.error('This option is invalid.', i, options[i]);
					continue;
				}
				that._options[i] = options[i];
			}
		}

		if (that._options.listContainerElement !== null && 'nodeName' in that._options.listContainerElement) {
			that._vars.listElement = that._options.listContainerElement;
			that._vars.listElement.classList.add(this._getClassName(that._options.listContainer));
		}
		else {
			that._vars.listElement = document.querySelector(this._getClassName(that._options.listContainer, true));
			// check if it's not an already created list
			if (that._vars.listElement.getAttribute('data-id') !== null) {
				that._vars.listElement = null;
			}
		}

		if (that._vars.listElement === null) {
			console.error('Could not find main list container element.', this._getClassName(that._options.listContainer, true));
			return;
		}

		that._vars.listElement.parentNode.classList.add(this._getClassName(that._options.listContainerParent));

		that._vars.id = '' + new Date().getTime() + Math.round(Math.random() * 100000);
		that._vars.listElement.setAttribute('data-id', that._vars.id);

		if (that._vars.isIOS === true) {
			that._vars.listElement.classList.add('os-is-ios');
		}
		if (that._vars.isAndroid === true) {
			// With the 3D acceleration the scrolling is nicer... 
			// but it gets very slow on Android default browser.
			// so disable acceleration for it
			if (that._vars.isAndroidStockBrowser === false) {
				that._vars.listElement.classList.add('os-is-android');
			}
		}

		that._vars.listElement.classList.add(that._options.cssPrefix);

		pubsub.subscribe('mbs.performlist.start.' + that._vars.id, function() {
			if (that._vars.isStarted === true) {
				return;
			}
			that.start();
			that._vars.isStarted = true;
		});

		pubsub.subscribe('mbs.performlist.stop.' + that._vars.id, function() {
			if (that._vars.isStarted === false) {
				return;
			}
			that.stop();
			that._vars.isStarted = false;
		});

		pubsub.subscribe('mbs.performlist.ready.' + that._vars.id, function() {
			if (that._options.autoStartAfterReady === true && that._vars.filter === null) {
				pubsub.publish('mbs.performlist.start.' + that._vars.id);
			}
		});

		// iScroll4 / 5 detection
		if (typeof window.IScroll === 'function' && typeof window.iScroll !== 'function') {
			window.iScroll = window.IScroll;
		}

		this._loadPlugins();
	};

	Performlist.prototype.getListElement = function() {
		var that = this;
		return that._vars.listElement;
	};

	Performlist.prototype.getId = function() {
		var that = this;
		return that._vars.id;
	};

	Performlist.prototype.start = function() {
		var that = this;

		if (typeof window.iScroll === 'function') {
			var iScrollInst = null;

			// first try
			if (typeof that._vars.listElement.iScroll !== 'undefined') {
				if (that._vars.listElement.iScroll instanceof window.iScroll) {
					iScrollInst = that._vars.listElement.iScroll;
				}
			}

			// second try
			if (iScrollInst !== null && typeof $ === 'function') {
				iScrollInst = $(that._vars.listElement).data("iscroll");
			}

			if (iScrollInst instanceof window.iScroll) {
				that._vars.iScrollInst = that._vars.listElement.iScroll = iScrollInst;
			}
		}

		if (that._vars.iScrollInst === null) {
			if (that._vars.listElement.classList.contains('browser-scroll') === false) {
				that._vars.listElement.classList.add('browser-scroll');
			}
		}

		that._listToListItemClick(that._vars.listElement);
		that._vars.scrollingStatusId = this._enableScrollingStatus();

		that._vars._cb_afterListResize = function() {
			that._onListResize();
		};
		that._vars.listElement.addEventListener('resize', that._vars._cb_afterListResize, false);

		that._startListeners();
	};

	Performlist.prototype.stop = function() {
		var that = this;

		if (that._vars.fastButtonListInst !== null) {
			that._vars.fastButtonListInst.destroy(that._vars.listElement);
			that._vars.fastButtonListInst = null;
		}

		if (that._vars.scrollingStatusId > 0) {
			window.clearInterval(that._vars.scrollingStatusId);
		}

		that._vars.listElement.removeEventListener("resize", that._vars._cb_afterListResize, false);

		that._stopListeners();
	};

	/*
	 * Insert the given data into the list. Accepts data with or without 
	 * category :
	 * ['a', 'b']
	 * or
	 * {'cat1': 'a', 'b'}
	 * Send a 'ready' event when data is inserted into the list.
	 * 
	 * @param {Array or Object} items : the items of the list
	 * @returns {Boolean} returns true is success
	 */
	Performlist.prototype.setData = function(items) {
		var that = this;

		that._vars.listItems = [];

		if (that._vars.filter !== null) {
			that._vars.filter.destroy();
			that._vars.filter = null;
		}

		if (items instanceof Array) {
			that._vars.itemsType = "array";
			that._options.categoryType = "ul";
			that._options.itemType = "li";
			this._buildItemsAsArray(items);
		}
		else if (items instanceof Object) {
			that._vars.itemsType = 'object';
			if (that._options.dependsOnUlLi === false) {
				that._options.categoryType = 'dl';
				that._options.titleType = 'dt';
				that._options.itemType = 'dd';
			}

			if (that._vars.filterBuilder !== null && typeof that._options.minItemsForFilters === 'number' && jsDomTools.objectTotalLength(items) >= that._options.minItemsForFilters) {
				that._vars.filter = new that._vars.filterBuilder();
				var options = {
					id: that._vars.id,
					listElement: that._vars.listElement,
					autoStartAfterReady: that._options.autoStartAfterReady
				};
				that._vars.filter.init(options);
				that._vars.filter.addListSpaceForFilterElement();
			}
			this._buildItemsAsObject(items);
		}
		else {
			console.error('Provided data is not an array not an object');
			return false;
		}

		this._buildListScroller();

		if (that._vars.optimizer !== null) {
			that._vars.optimizer.loadFromElement(that._vars.scrollerElement);
		}
		else {
			this._buildFullListItems();
		}

		if (that._vars.filter !== null) {
			var _titleElements = that._vars.listElement.querySelectorAll(this._getClassName('category-title [data-letter]', true));
			that._vars.filter.setTitleElements(_titleElements);
		}

		pubsub.publish("mbs.performlist.ready." + that._vars.id);

		return true;
	};

	// Private Methods //
	Performlist.prototype._getClassName = function(item, returnDot) {
		var that = this;

		if (typeof item !== 'string' && item !== '') {
			console.error('Invalid parameter', item);
			return '';
		}
		var className = that._options.cssPrefix + '-' + item;
		if (returnDot === true) {
			className = '.' + className;
		}
		return className;
	};

	Performlist.prototype._buildItemsAsArray = function(items) {
		var that = this;

		if (items instanceof Array === false) {
			console.error('Invalid parameter', items);
			return false;
		}

		var _itemNodeTemplate = document.createElement(that._options.itemType);
		_itemNodeTemplate.classList.add(this._getClassName('category-item'));

		var _maxLen = items.length;
		for (var i = 0; i < _maxLen; i++) {
			var _itemNode = _itemNodeTemplate.cloneNode();
			_itemNode.innerHTML = items[i];
			that._vars.listItems.push(_itemNode);
		}
	};

	Performlist.prototype._buildItemsAsObject = function(items) {
		var that = this;

		if (items instanceof Object === false) {
			console.error('Invalid parameter', items);
			return false;
		}

		var _titleNodeTemplate = document.createElement(that._options.titleType);
		_titleNodeTemplate.classList.add(this._getClassName('category-title'));
		if (that._options.categoryTitleExtraClass !== '') {
			_titleNodeTemplate.classList.add(that._options.categoryTitleExtraClass);
		}

		var _itemNodeTemplate = document.createElement(that._options.itemType);
		_itemNodeTemplate.classList.add(this._getClassName('category-item'));
		if (that._options.categoryItemExtraClass !== '') {
			_itemNodeTemplate.classList.add(that._options.categoryItemExtraClass);
		}

		for (var title in items) {
			var _fragment = document.createDocumentFragment();
			var _titleNode = _titleNodeTemplate.cloneNode();
			if (that._vars.filter !== null) {
				_titleNode.innerHTML = that._vars.filter.createTitleHTML(title);
				that._vars.filter.addTitleItem(title);
			}
			else {
				_titleNode.innerHTML = title;
			}
			_fragment.appendChild(_titleNode);

			for (var i = 0; i < items[title].length; i++) {
				var _itemNode = _itemNodeTemplate.cloneNode();
				_itemNode.innerHTML = items[title][i];
				_fragment.appendChild(_itemNode);
			}

			that._vars.listItems.push(_fragment);
		}
	};

	Performlist.prototype._buildListScroller = function() {
		var that = this;
		var _itemParentElement;

		if (that._options.listScrollerElement !== null) {
			_itemParentElement = that._options.listScrollerElement;
		}
		else {
			_itemParentElement = document.createElement(that._options.categoryType);
		}

		_itemParentElement.classList.add(this._getClassName(that._options.listScroller));
		if (that._options.listScrollerExtraClass !== '') {
			_itemParentElement.classList.add(that._options.listScrollerExtraClass);
		}
		_itemParentElement.innerHTML = '<p class="perform-list-labels">Building...</p>';

		that._vars.listElement.innerHTML = '';
		that._vars.listElement.appendChild(_itemParentElement);

		if (that._vars.preventPageScroller !== null) {
			if (that._vars.isIOS === true) {
				//that._vars.preventPageScroller.preventScrolling();
				that._vars.preventPageScroller.preventScrollingOnListParent(that._vars.listElement);
			}
		}

		that._vars.scrollerElement = _itemParentElement;
	};

	Performlist.prototype._buildFullListItems = function() {
		var that = this;
		var _fragment = document.createDocumentFragment();

		var _maxLen = that._vars.listItems.length;
		for (var i = 0; i < _maxLen; i++) {
			var _itemNode = that._vars.listItems[i];
			_fragment.appendChild(_itemNode);
		}

		// one shot DOM update
		that._vars.scrollerElement.innerHTML = '';
		that._vars.scrollerElement.appendChild(_fragment);
	};

	Performlist.prototype._enableScrollingStatus = function() {
		var that = this;

		if (typeof that._vars.listElement.scrollTop !== 'number') {
			console.error('This item is not a scrolling list');
			return;
		}
		var currentScrollTop = 0;
		var lastScrollTop = 0;
		var isListScrolling = false;
		var clearerId = 0;

		function checkIsScrolling() {
			if (that._vars.iScrollInst !== null) {
				currentScrollTop = parseInt(that._vars.iScrollInst.y);
			}
			else {
				currentScrollTop = that._vars.listElement.scrollTop;
			}

			var _isListScrolling = (currentScrollTop === lastScrollTop);

			if (_isListScrolling !== isListScrolling) {
				isListScrolling = _isListScrolling;
				if (isListScrolling === true) {
					if (clearerId > 0) {
						window.clearTimeout(clearerId);
						clearerId = 0;
					}
					clearerId = window.setTimeout(function() {
						//console.log('-scrolling');
						that._vars.listElement.removeAttribute('is-scrolling');
					}, 300);
				}
				else {
					that._vars.listElement.setAttribute('is-scrolling', '');
					//console.log('+scrolling');
				}
			}
			lastScrollTop = currentScrollTop;
		}
		return window.setInterval(checkIsScrolling, 20);
	};

	Performlist.prototype._listToListItemClick = function(element) {
		var that = this;

		var isTouchSupported = 'ontouchend' in document;
		var eventType = (isTouchSupported === true) ? 'touchend' : 'click';

		function onListClick(event) {
			//console.log('onListClick!!', event.target, event.type);
			if (event.type !== eventType) {
				event.preventDefault();
				event.stopPropagation();
				//console.log('--- event canceled! (not ' + eventType + ') ---');
				return;
			}

			var _listContainerElement = jsDomTools.findParentNodeWithClassName(event.target.parentNode, that._getClassName(that._options.listContainer));
			if (_listContainerElement !== null) {
				var isDisabled = (_listContainerElement.getAttribute('is-disabled') !== null);
				var isScrolling = (_listContainerElement.getAttribute('is-scrolling') !== null);

				//console.log('is-scrolling: ' + isScrolling + ' ' + _listContainerElement.className);
				//console.log('is-disabled: ' + isDisabled + ' ' + _listContainerElement.className);

				if (isScrolling === true) {
					//console.log('--- event canceled! (scrolling) ---');
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				if (isDisabled === true) {
					//console.log('--- event canceled! (disabled) ---');
					event.preventDefault();
					event.stopPropagation();
					return;
				}
			}

			//console.log('--- event validated! ---');

			var _listItemElement = jsDomTools.findParentNodeWithNodeName(event.target, that._options.itemType);
			if (_listItemElement !== null) {
				var data = {
					target: event.target,
					listItem: _listItemElement
				};
				pubsub.publish('mbs.performlist.click.' + that._vars.id, data);
			}
		}

		that._vars.fastButtonListInst = new MBP.fastButton(element, onListClick);
	};

	Performlist.prototype._loadPlugins = function() {
		var that = this;
		var _hasNoPlugin = true;

		that._vars.pluginsToLoad = [];
		that._vars.pluginsToLoad.filter = false;
		that._vars.pluginsToLoad.optimizer = false;
		that._vars.pluginsToLoad.preventPageScroller = false;

		if (that._options.useOptimizer === true) {
			_hasNoPlugin = false;
			require(['perform-list/perform-list-optimizer'], function(OptimizerBuilder) {
				that._vars.optimizer = new OptimizerBuilder();
				var __options = {
					'id': that._vars.id,
					'listElement': that._vars.listElement,
					'scrollerElement': that._vars.listScroller,
					'listItems': that._vars.listItems
				};
				that._vars.optimizer.init(__options);
				that._vars.pluginsToLoad.optimizer = true;
				that._areAllPluginsLoaded();
			});
		}
		if (that._options.useFilters === true) {
			_hasNoPlugin = false;
			require(['perform-list/perform-list-filter'], function(FilterBuilder) {
				that._vars.filterBuilder = FilterBuilder;
				that._vars.pluginsToLoad.filter = true;
				that._areAllPluginsLoaded();
			});
		}
		if (that._options.usePreventPageScroller === true) {
			_hasNoPlugin = false;
			require(['perform-list/perform-list-prevent-page-scroll'], function(preventPageScroller) {
				that._vars.preventPageScroller = preventPageScroller;
				that._vars.pluginsToLoad.preventPageScroller = true;
				that._areAllPluginsLoaded();
			});
		}

		if (_hasNoPlugin === true) {
			that._areAllPluginsLoaded();
		}
	};

	Performlist.prototype._areAllPluginsLoaded = function() {
		var that = this;
		if (that._options.useOptimizer !== that._vars.pluginsToLoad.optimizer) {
			return;
		}
		if (that._options.useFilters !== that._vars.pluginsToLoad.filter) {
			return;
		}
		if (that._options.usePreventPageScroller !== that._vars.pluginsToLoad.preventPageScroller) {
			return;
		}

		// need this event to be send async
		window.setTimeout(function() {
			pubsub.publish('mbs.performlist.initialized.' + that._vars.id);
		}, 0);
	};

	Performlist.prototype._onListResize = function() {
		// Disabled for now because not used !
//		if (that._vars.scrollerElement === null || that._vars.listElement === null) {
//			return;
//		}
//
//		var csScrollingElement = window.getComputedStyle(that._vars.scrollerElement, null);
//		var csListElement = window.getComputedStyle(that._vars.listElement, null);
//
//		var _csScrollingElementHeight = csScrollingElement.height.replace('px', '');
//		var _csListElementHeight = csListElement.height.replace('px', '');
//
//		var _msg;
//		if (_csScrollingElementHeight < _csListElementHeight) {
//			_msg = 'content-smaller';
//		}
//		else {
//			_msg = 'content-bigger';
//		}
//		pubsub.publish('mbs.performlist.' + _msg + '.' + that._vars.id);
	};

	Performlist.prototype._startListeners = function() {
		var that = this;

		var _onResizeTimerId = 0;
		var _onResizeParams = {
			width: 0, height: 0
		};

		var checkIfResize = function() {
			if (that._vars.listElement === null) {
				return;
			}

			var cs = window.getComputedStyle(that._vars.listElement, null);
			var needRefresh = false;

			if (_onResizeParams.width !== cs.width) {
				needRefresh = true;
				_onResizeParams.width = cs.width;
			}
			if (_onResizeParams.height !== cs.height) {
				needRefresh = true;
				_onResizeParams.height = cs.height;
			}
			if (needRefresh === true) {
				pubsub.publish('mbs.performlist.resize.' + that._vars.id);
			}
		};

		that._vars._cb_afterWindowResize = function() {
			if (_onResizeTimerId > 0) {
				window.clearTimeout(_onResizeTimerId);
				_onResizeTimerId = 0;
			}
			_onResizeTimerId = window.setTimeout(checkIfResize, 500);
		};
		window.addEventListener('resize', that._vars._cb_afterWindowResize, false);

		// trigger a 'resize' event callback call to initialize the list
		that._vars._cb_afterWindowResize();
	};

	Performlist.prototype._stopListeners = function() {
		var that = this;
		document.removeEventListener('resize', that._vars._cb_afterWindowResize, false);
	};

	return Performlist;
});
