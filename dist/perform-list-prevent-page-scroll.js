/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.1.2 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define([ "js-dom-tools/js-dom-tools" ], function(jsDomTools) {
    "use strict";
    var console = jsDomTools.useDebug(false);
    var preventScrollingOnThis = function(element) {
        element.addEventListener("touchmove", function(event) {
            event.preventDefault();
        }, false);
    };
    var preventScrolling = function() {
        document.addEventListener("touchmove", function(event) {
            if (event.target.nodeName.toLowerCase() === "html" || event.target.nodeName.toLowerCase() === "body") {
                event.preventDefault();
                return;
            }
            if (event.target.type === "range") {
                return;
            }
            var parentNode = jsDomTools.findParentNodeWithClassName(event.target, "perform-list");
            if (parentNode !== null) {
                if (event.touches.length === 1) {
                    console.log("*** ACCEPTED **** ", event.target.nodeName, event.target.classList);
                    return;
                }
            }
            console.log("--preventScroll: ", event.target, event.target.parentNode.nodeName);
            event.preventDefault();
        }, false);
    };
    var preventScrollingOnListParent = function(scrollParentElement) {
        if (typeof scrollParentElement !== "object" || scrollParentElement === null) {
            return;
        }
        scrollParentElement.addEventListener("touchstart", function(event) {
            this.allowDown = this.scrollTop < this.scrollHeight - this.clientHeight;
            this.prevPageY = event.pageY;
            scrollParentElement.removeAttribute("is-disabled");
        }, false);
        scrollParentElement.addEventListener("touchmove", function(event) {
            var up = event.pageY > this.prevPageY;
            var down = event.pageY < this.prevPageY;
            if (up === true && this.scrollTop === 0 || down === true && this.allowDown === false) {
                scrollParentElement.setAttribute("is-disabled", "");
                event.preventDefault();
            }
        }, false);
    };
    return {
        preventScrolling: preventScrolling,
        preventScrollingOnListParent: preventScrollingOnListParent,
        preventScrollingOnThis: preventScrollingOnThis
    };
});