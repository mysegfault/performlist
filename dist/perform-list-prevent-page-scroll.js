/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.1.12 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define(["js-dom-tools/js-dom-tools"],function(a){"use strict";var b=function(a){a.addEventListener("touchmove",function(a){a.preventDefault()},!1)},c=function(){document.addEventListener("touchmove",function(b){if("html"===b.target.nodeName.toLowerCase()||"body"===b.target.nodeName.toLowerCase())return b.preventDefault(),void 0;if("range"!==b.target.type){var c=a.findParentNodeWithClassName(b.target,"perform-list");(null===c||1!==b.touches.length)&&b.preventDefault()}},!1)},d=function(a){"object"==typeof a&&null!==a&&(a.addEventListener("touchstart",function(b){this.allowDown=this.scrollTop<this.scrollHeight-this.clientHeight,this.prevPageY=b.pageY,a.removeAttribute("is-disabled")},!1),a.addEventListener("touchmove",function(b){var c=b.pageY>this.prevPageY,d=b.pageY<this.prevPageY;(c===!0&&0===this.scrollTop||d===!0&&this.allowDown===!1)&&(a.setAttribute("is-disabled",""),b.preventDefault())},!1))};return{preventScrolling:c,preventScrollingOnListParent:d,preventScrollingOnThis:b}});