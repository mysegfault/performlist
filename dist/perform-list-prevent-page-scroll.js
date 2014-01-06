/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.1.7 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define(["js-dom-tools/js-dom-tools"],function(a){"use strict";var b=a.useDebug(!1),c=function(a){a.addEventListener("touchmove",function(a){a.preventDefault()},!1)},d=function(){document.addEventListener("touchmove",function(c){if("html"===c.target.nodeName.toLowerCase()||"body"===c.target.nodeName.toLowerCase())return c.preventDefault(),void 0;if("range"!==c.target.type){var d=a.findParentNodeWithClassName(c.target,"perform-list");if(null!==d&&1===c.touches.length)return b.log("*** ACCEPTED **** ",c.target.nodeName,c.target.classList),void 0;b.log("--preventScroll: ",c.target,c.target.parentNode.nodeName),c.preventDefault()}},!1)},e=function(a){"object"==typeof a&&null!==a&&(a.addEventListener("touchstart",function(b){this.allowDown=this.scrollTop<this.scrollHeight-this.clientHeight,this.prevPageY=b.pageY,a.removeAttribute("is-disabled")},!1),a.addEventListener("touchmove",function(b){var c=b.pageY>this.prevPageY,d=b.pageY<this.prevPageY;(c===!0&&0===this.scrollTop||d===!0&&this.allowDown===!1)&&(a.setAttribute("is-disabled",""),b.preventDefault())},!1))};return{preventScrolling:d,preventScrollingOnListParent:e,preventScrollingOnThis:c}});