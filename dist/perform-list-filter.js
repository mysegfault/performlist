/* 
 * performlist: Performlist is an HTML5 library for making fast scrolling lists (like Contact list) 
 * v0.2.2 
 * 
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/performlist 
 * MIT Licence 
 * 
 */
define(["raf.js/raf.min","tweenjs/tween.min","pubsub-js/pubsub","js-dom-tools/js-dom-tools"],function(a,b,c,d){"use strict";var e=function(){var a=this;a._options={maxFilterHeight:23,filterWidth:30,useAnimatedScrolling:!1,autoStartAfterReady:!1},a._vars={listElement:null,titleItems:[],titleElements:null,visibleFilterElements:null,isResizingId:0,filterHeight:0,filterElements:null,filterContainerElement:null,isManualScrolling:!1,isBuildingOnScrollItems:!0,indexesTopTitles:[],selectedFilterElement:null,isAndroid:!1,isIOS:!1,eventCallbacks:[],id:0,isReady:!1,pubsubTokens:[],iScrollInst:null,filterContainerElementTop:0,isStarted:!1}};return e.prototype.init=function(a){var b=this;return b._vars.listElement=a.listElement,null===b._vars.listElement?(console.error("PerformFilter main list element is invalid",b._vars.listElement),void 0):(b._vars.id=a.id,b._options.autoStartAfterReady=a.autoStartAfterReady,0===b._vars.id.length?(console.error("PerformFilter main list ID is invalid",b._vars.id),void 0):(b._vars.isAndroid=null!==navigator.userAgent.match(/Android/i),b._vars.isIOS=null!==window.navigator.userAgent.match(/OS .+_.* like/),b._vars.pubsubTokens.push(c.subscribe("mbs.performlist.initialized."+b._vars.id,function(){b.initialized()})),b._vars.pubsubTokens.push(c.subscribe("mbs.performlist.ready."+b._vars.id,function(){b.ready(),b.resize()})),b._vars.pubsubTokens.push(c.subscribe("mbs.performlist.start."+b._vars.id,function(){return b._vars.isReady===!1?(console.error("Try to start filters but not ready yet."),void 0):b._vars.isStarted===!0?(console.error("Try to start but already started."),void 0):(b.start(),void 0)})),b._vars.pubsubTokens.push(c.subscribe("mbs.performlist.stop."+b._vars.id,function(){return b._vars.isStarted===!1?(console.error("Try to stop but no yet started."),void 0):(b.stop(),void 0)})),b._vars.pubsubTokens.push(c.subscribe("mbs.performlist.resize."+b._vars.id,function(){b.resize()})),void 0))},e.prototype.initialized=function(){},e.prototype.ready=function(){var a=this,b=a._vars.listElement.querySelector(".perform-list-scroller");return null===b?(console.error("scrollerElement could not be found",b),void 0):(a._buildFilterContainerElement(),a._options.autoStartAfterReady===!0&&c.publish("mbs.performlist.start."+a._vars.id),a._vars.isReady=!0,void 0)},e.prototype.start=function(){var a=this;"function"==typeof window.iScroll&&a._vars.listElement.iScroll instanceof window.iScroll&&(a._vars.iScrollInst=a._vars.listElement.iScroll),a._startListenersOnFilterContainerElement(),a._vars.filterContainerElementTop=d.getOffsetSum(a._vars.filterContainerElement).top},e.prototype.stop=function(){var a=this;a._stopListenersOnFilterContainerElement()},e.prototype.destroy=function(){var a=this;null!==a._vars.iScrollInst&&(a._vars.iScrollInst.destroy(),a._vars.iScrollInst=null);for(var b=0;b<a._vars.pubsubTokens.length;b++){var d=a._vars.pubsubTokens[b];c.unsubscribe(d)}if(a.removeListSpaceForFilterElement(),a._vars.titleItems=[],a._vars.isStarted===!0&&a.stop(),a._vars.isReady===!0){var e=a._vars.listElement.parentNode,f=e.querySelector(".perform-list-filters");e.removeChild(f),a._vars.isReady=!1}},e.prototype.createTitleHTML=function(a){if("string"!=typeof a)return console.error("Invalid content"),"";var b='<span data-letter="'+a[0].toLowerCase()+'">'+a+"</span>";return b},e.prototype.addTitleItem=function(a){var b=this;b._vars.titleItems.push(a)},e.prototype._buildFilterContainerElement=function(){function a(){var a=document.createElement("div");a.classList.add("perform-list-filters");for(var c="",d=0;d<b._vars.titleItems.length;d++){var e=b._vars.titleItems[d];c+='<button class="perform-list-filters-button" data-letter="'+e[0].toLowerCase()+'">'+e[0].toUpperCase()+"</button>"}return a.innerHTML=c,a.classList.add("cursor-pointer"),a}var b=this;return 0===b._vars.titleItems.length?(console.error("PerformList Filter could not find any title"),void 0):(b._vars.filterContainerElement=a(),require(["perform-list/perform-list-prevent-page-scroll"],function(a){a.preventScrollingOnThis(b._vars.filterContainerElement)}),void 0)},e.prototype._startListenersOnFilterContainerElement=function(){function a(){null===c._vars.iScrollInst&&null!==c._vars.listElement.getAttribute("is-scrolling")&&(c._vars.listElement.style.overflowY="hidden",window.setTimeout(function(){c._vars.listElement.style.overflowY="scroll"},0))}function b(a){if("button"===a.target.nodeName.toLowerCase()){var b=c._getCurrentItem(a);null!==b&&c._onNewSelectedFilter(b,"touchend"===a.type)}}var c=this;if(null===c._vars.filterContainerElement)return console.error("PerformList Filter could not find index container element"),void 0;var d="ontouchend"in document,e="undefined"!=typeof window.navigator.msPointerEnabled;if(d===!0||e===!0){var f=e===!0?"MSPointerDown":"touchstart",g=e===!0?"MSPointerMove":"touchmove",h=e===!0?"MSPointerUp":"touchend";c._vars.eventCallbacks.touchstart={parent:c._vars.filterContainerElement,callback:a},c._vars.filterContainerElement.addEventListener(f,a,!1),c._vars.eventCallbacks.touchmove={parent:c._vars.filterContainerElement,callback:b},c._vars.filterContainerElement.addEventListener(g,b,!1),c._vars.eventCallbacks.touchend={parent:c._vars.filterContainerElement,callback:b},c._vars.filterContainerElement.addEventListener(h,b,!1)}else c._vars.eventCallbacks.click={parent:c._vars.filterContainerElement,callback:b},c._vars.filterContainerElement.addEventListener("click",b,!1)},e.prototype._stopListenersOnFilterContainerElement=function(){var a=this;for(var b in a._vars.eventCallbacks)if(a._vars.eventCallbacks.hasOwnProperty(b)!==!1){var c=a._vars.eventCallbacks[b];c.parent.removeEventListener(b,c.callback,!1)}},e.prototype.setTitleElements=function(a){var b=this;b._vars.titleElements=a},e.prototype.addListSpaceForFilterElement=function(){var a=this;return null===a._vars.listElement?(console.error("Could not find listElement",a._vars.listElement),void 0):(a._vars.listElement.style.marginRight=a._options.filterWidth+"px",void 0)},e.prototype.removeListSpaceForFilterElement=function(){var a=this;return null===a._vars.listElement?(console.error("Could not find listElement",a._vars.listElement),void 0):(a._vars.listElement.style.marginRight="0px",void 0)},e.prototype._insertFilterContainerElement=function(){var a=this,b=a._vars.listElement.parentNode;null===b.querySelector(".perform-list-filters")&&(b.insertBefore(a._vars.filterContainerElement,a._vars.listElement),a._vars.filterContainerElement.style.width=a._options.filterWidth+"px")},e.prototype._updateFiltersList=function(){function a(a){var c=[],d=b._vars.filterContainerElement.querySelectorAll(".perform-list-filters-button"),e=a-2+1,f=d.length-2,g=f/e,h=[];h.push(0);for(var i=0;e-1>i;i++)h.push(Math.ceil(g*(i+1)));a>1&&h.push(d.length-1);for(var j=0;j<d.length;j++){var k=d[j];-1!==h.indexOf(j)?(k.classList.remove("hidden"),c.push(k)):k.classList.add("hidden")}return c}var b=this,c=window.getComputedStyle(b._vars.listElement,null),d={height:0,lineHeight:0,end:""};d.height=c.height.replace("px",""),d.lineHeight=d.height/b._vars.titleItems.length,d.lineHeight<b._options.maxFilterHeight&&(d.lineHeight=b._options.maxFilterHeight);var e=parseInt(d.height/d.lineHeight);d.lineHeight=d.height/e,b._vars.filterHeight=d.lineHeight,b._vars.visibleFilterElements=a(e);for(var f=0;f<b._vars.visibleFilterElements.length;f++){var g=b._vars.visibleFilterElements[f];g.style.height=b._vars.filterHeight+"px"}b._vars.filterContainerElement.style.height=d.height+"px",null===b._vars.iScrollInst&&b._getIndexesTopTitles()},e.prototype.resize=function(){var a=this;return a._vars.isReady===!1?(console.error("Not ready yet."),void 0):(a._updateFiltersList(),a._insertFilterContainerElement(),void 0)},e.prototype._goToListTitle=function(a,b){var c=this;if("string"!=typeof a)return console.error("Selected letter is invalid"),!1;b=b===!0;var e=c._vars.listElement.querySelector('[data-letter="'+a+'"]');if(null===e)return console.error("Selected filter is invalid"),!1;if(null!==c._vars.iScrollInst)"function"==typeof window.IScroll?c._vars.iScrollInst.scrollToElement(e,0):(c._vars.iScrollInst.scrollToElement(e,0),c._vars.iScrollInst.scrollTo(0,-3,0,!0));else{var f=d.getOffsetSum(e).top-c._vars.filterContainerElementTop-3;if(0>=f&&(f=1),c._options.useAnimatedScrolling===!0&&b===!0){var g=c._vars.listElement.scrollTop;c._vars.isManualScrolling=!0,new TWEEN.Tween({x:g,y:0}).to({x:f},500).easing(TWEEN.Easing.Circular.InOut).onUpdate(function(){c._vars.listElement.scrollTop=this.x}).onComplete(function(){c._vars.isManualScrolling=!1}).start();var h=function(){requestAnimationFrame(h),TWEEN.update()};h()}else c._vars.listElement.scrollTop=f,c._vars.isManualScrolling=!1}},e.prototype._getIndexesTopTitles=function(){var a=this;if(null===a._vars.titleElements)return console.error("not yet"),void 0;var b=0;a._vars.indexesTopTitles=[],a._vars.isBuildingOnScrollItems=!0;for(var c=0;c<a._vars.titleElements.length;c++){var e=a._vars.titleElements[c],f=e.getAttribute("data-letter");if(null!==f)for(var g=d.getOffsetSum(e).top;g>=b;)a._vars.indexesTopTitles[b]=0===c?0:c-1,b++;else console.error("Invalid filter")}a._vars.isBuildingOnScrollItems=!1},e.prototype._getCurrentItem=function(a){var b=this,c=null,d=null;if("undefined"!=typeof a.touches&&a.touches.length>0?d=a.touches[0].pageY-b._vars.filterContainerElementTop:"undefined"!=typeof a.changedTouches&&a.changedTouches.length>0?d=a.changedTouches[0].pageY-b._vars.filterContainerElementTop:"undefined"!=typeof a.pageY&&(d=a.pageY-b._vars.filterContainerElementTop),null!==d){var e=parseInt(d/b._vars.filterHeight);0>e&&(e=0),e>=b._vars.visibleFilterElements.length&&(e=b._vars.visibleFilterElements.length-1),c=b._vars.visibleFilterElements[e]}else a.target.classList.contains("perform-list-filters-button")===!0&&(c=a.target);return c},e.prototype._onNewSelectedFilter=function(a,b){var c=this;if("undefined"==typeof a||null===a)return console.error("Invalid parameter selectedFilterElement: ",a),!1;b=b===!0;var d=a.getAttribute("data-letter");null!==d&&c._goToListTitle(d,b)},e});