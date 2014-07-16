/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.1.14 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define(["html5-mobile-boilerplate/helper","pubsub-js/pubsub","js-dom-tools/js-dom-tools"],function(a,b){"use strict";var c=function(){var a=this;a._options={maxItemsMatrix:{ios6:500,android4_0:500,android4_1:500,android4_2:500},end:""},a._vars={listElement:null,scrollerElement:null,listItems:null,htmls:{},maxItems:3e3,id:0,end:""}};return c.prototype.init=function(a){var c=this;c._vars.listElement=a.listElement,c._vars.listItems=a.listItems,c._vars.id=a.id,b.subscribe("mbs.performlist.start."+c._vars.id,function(){c.start()})},c.prototype.start=function(){},c.prototype.stop=function(){},c.prototype.loadFromElement=function(a){var b=this;b._vars.scrollerElement=a,this._automaticMaxItemsSelection(),this._loadFrom(0)},c.prototype._automaticMaxItemsSelection=function(){var a=this,b=null!==window.navigator.userAgent.match(/OS 6_.* like/);if(b===!0)return a._vars.maxItems=a._options.maxItemsMatrix.ios6,void 0;var c=null!==window.navigator.userAgent.match(/OS 7_.* like/);if(c!==!0){var d=null!==window.navigator.userAgent.match(/Android 4\.0/);if(d===!0)return a._vars.maxItems=a._options.maxItemsMatrix.android4_0,void 0;var e=null!==window.navigator.userAgent.match(/Android 4\.1/);if(e===!0)return a._vars.maxItems=a._options.maxItemsMatrix.android4_1,void 0;var f=null!==window.navigator.userAgent.match(/Android 4\.2/);return f===!0?(a._vars.maxItems=a._options.maxItemsMatrix.android4_2,void 0):void 0}},c.prototype._loadFrom=function(a,c){c=c===!0,"number"!=typeof a&&(a=0);var d,e=this;e._vars.scrollerElement.innerHTML="",0>a&&(a=0),a>0&&(d=document.createElement("div"),d.innerHTML="Click for PREVIOUS",d.classList.add("text-centered"),d.style.padding="20px",new MBP.fastButton(d,function(){e._loadFrom(a-e._vars.maxItems,!0)}),d.classList.add("cursor-pointer"),e._vars.scrollerElement.appendChild(d));for(var f=a;f<e._vars.maxItems+a&&"undefined"!=typeof e._vars.listItems[f];f++)d=e._vars.listItems[f],e._vars.scrollerElement.appendChild(d);"undefined"!=typeof e._vars.listItems[f]&&(d=document.createElement("div"),d.setAttribute("is-loader",f),d.innerHTML="Click for NEXT",d.style.padding="20px",d.classList.add("text-centered"),new MBP.fastButton(d,function(){e._loadFrom(f)}),d.classList.add("cursor-pointer"),e._vars.scrollerElement.appendChild(d)),b.publish("mbs.performlist.ready."+e._vars.id),setTimeout(function(){e._vars.scrollerElement.scrollIntoView(!c)},10)},c});