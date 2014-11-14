/*
 * JavaScript DOM tools library
 * 2014-11-14
 * v0.1.6
 *
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/js-dom-tools
 * 
 * MIT Licence
 */

require.config({
	map: {
		'*': {
			'css': 'require-css/css'
		}
	}
});

define([], function() {

	function loadAsyncScript(src, id, callback) {
		if (typeof src !== 'string') {
			console.error('src parameter is invalid: [' + src + ']');
			return;
		}
		var tag = document.createElement('script');
		tag.src = src;
		tag.async = true;
		if (typeof id === 'string' && isEmpty(id) === false) {
			tag.id = id;
		}

		if (typeof callback === 'function') {
			tag.addEventListener("load", function load(event) {
				tag.removeEventListener("load", load, false);
				callback(event);
			}, false);
		}

		document.body.appendChild(tag);
	}

	function loadAsyncCss(src, callback) {
		if (typeof src !== 'string') {
			console.error('src parameter is invalid: [' + src + ']');
			return;
		}

		require(['css!' + src], function() {
			if (typeof callback === 'function') {
				callback();
			}
		});

//		var tag = document.createElement('link');
//		tag.rel = 'stylesheet';
//		tag.href = src;
//		tag.async = true;

//		if (typeof callback === 'function') {
//			var called = false;
//			tag.onload = function() {
//				if (called === false) {
//					called = true;
//					callback(event);
//				}
//				tag.onload = null;
//			};

//			tag.addEventListener('load', function load(event) {
//				if (called === false) {
//					called = true;
//					callback(event);
//				}
//				tag.removeEventListener('load', load, false);
//			}, false);
//		}

//		document.head.appendChild(tag);
	}

	function findParentNodeWithNodeName(element, nodeName) {
		if (element === null || typeof element !== 'object') {
			return null;
		}
		if (typeof nodeName !== 'string') {
			console.error('className parameter is not valid: ' + nodeName);
			return null;
		}

		if (element.nodeName.toLowerCase() === 'body') {
			return null;
		}

		if (element.nodeName.toLowerCase() === nodeName.toLowerCase()) {
			return element;
		}
		else {
			return findParentNodeWithNodeName(element.parentNode, nodeName);
		}
	}

	function findParentNodeWithClassName(element, className) {

		if (element === null || typeof element !== 'object') {
			return null;
		}
		if (typeof className !== 'string') {
			console.error('className parameter is not valid: ' + className);
			return null;
		}

		if (element.nodeName.toLowerCase() === 'body') {
			return null;
		}

		if (element.classList.contains(className) === true) {
			return element;
		}
		else {
			return findParentNodeWithClassName(element.parentNode, className);
		}
	}

	function findParentNodeWithAttribute(element, attributeName) {

		if (element === null || typeof element !== 'object') {
			return null;
		}
		if (typeof attributeName !== 'string') {
			console.error('attributeName parameter is not valid: ' + attributeName);
			return null;
		}
		if (typeof element.getAttribute !== 'function') {
			return null;
		}

		if (element.getAttribute(attributeName) !== null) {
			return element;
		}
		else {
			return findParentNodeWithAttribute(element.parentNode, attributeName);
		}
	}

	function objectTotalLength(object) {

		if (typeof object !== 'object') {
			console.error('objectTotalLength: object is not an object. ', object);
			return 0;
		}

		if ('length' in object) {
			return object.length;
		}
		if (typeof object !== 'object') {
			return 0;
		}

		var totalLength = 0;
		for (var i in object) {
			totalLength += objectTotalLength(object[i]);
		}
		return totalLength;
	}

	function getOffsetSum(elem) {
		var top = 0, left = 0;

		while (elem) {
			top = top + parseInt(elem.offsetTop);
			left = left + parseInt(elem.offsetLeft);
			elem = elem.offsetParent;
		}

		return {top: top, left: left};
	}

	function isEmpty(data) {
		if (data === null || typeof data === 'undefined') {
			return true;
		}
		if (typeof data.length === 'number' && data.length === 0) {
			return true;
		}
		if (typeof data === 'string' && data.trim() === '') {
			return true;
		}

		// if it's a DOM element, returns true because not null
		// needed for iOS
		if (typeof data === 'object' && isDOMElement(data) === true) {
			return false;
		}
		if (typeof data === 'object' && Object.getOwnPropertyNames(data).length === 0) {
			return true;
		}

		return false;
	}

	function getItemHeight(element) {
		if (typeof element === 'undefined' || element === null) {
			console.error('getItemHeight: item is invalid', element);
			return 0;
		}
		var cs = window.getComputedStyle(element, null);
		if (isEmpty(cs) === true) {
			console.error('Could not get getComputedStyle of ', element);
			return 0;
		}
		if (cs.height === 'auto') {
			return 0;
		}
		var height = parseInt(cs.height.replace('px', ''));
		if (isNaN(height) === true) {
			console.error('getItemHeight: item height is invalid', element);
			height = 0;
		}
		return height;
	}

	function getItemWidth(element) {
		if (typeof element === 'undefined' || element === null) {
			console.error('getItemHeight: item is invalid', element);
			return 0;
		}
		var cs = window.getComputedStyle(element, null);
		if (isEmpty(cs) === true) {
			console.error('Could not get getComputedStyle of ', element);
			return 0;
		}
		if (cs.width === 'auto') {
			return 0;
		}
		var width = parseInt(cs.width.replace('px', ''));
		if (isNaN(width) === true) {
			console.error('getItemWidth: item width is invalid', element);
			width = 0;
		}
		return width;
	}

	function removeElement(element) {
		if (isEmpty(element) === true) {
			return;
		}
		var parent = element.parentNode;
		if (isEmpty(parent) === true) {
			console.error('This item has not parent', element, ' so it cannot be removed.');
			return;
		}
		parent.removeChild(element);
	}

	function loadAsyncImage(src, id, callback) {
		if (typeof src !== 'string') {
			console.error('src parameter is invalid: [' + src + ']');
			return;
		}
		var tag = document.createElement('img');
		tag.src = src;
		tag.async = true;
		tag.style.visibility = 'hidden';
		tag.style.position = 'absolute';
		if (typeof id === 'string' && isEmpty(id) === false) {
			tag.id = id;
		}

		if (typeof callback === 'function') {
			tag.addEventListener('load', function load(event) {
				tag.removeEventListener('load', load, false);
				callback(event);
			}, false);
		}

		document.body.appendChild(tag);
	}

	// see http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
	function isDOMElement(obj) {
		try {
			//Using W3 DOM2 (works for FF, Opera and Chrom)
			return obj instanceof HTMLElement;
		}
		catch (e) {
			//Browsers not supporting W3 DOM2 don't have HTMLElement and
			//an exception is thrown and we end up here. Testing some
			//properties that all elements have. (works on IE7)
			return (typeof obj === "object") &&
				(obj.nodeType === 1) && (typeof obj.style === "object") &&
				(typeof obj.ownerDocument === "object");
		}
	}

	return {
		loadAsyncScript: loadAsyncScript,
		loadAsyncCss: loadAsyncCss,
		findParentNodeWithNodeName: findParentNodeWithNodeName,
		findParentNodeWithClassName: findParentNodeWithClassName,
		findParentNodeWithAttribute: findParentNodeWithAttribute,
		objectTotalLength: objectTotalLength,
		getOffsetSum: getOffsetSum,
		isEmpty: isEmpty,
		getItemHeight: getItemHeight,
		getItemWidth: getItemWidth,
		removeElement: removeElement,
		loadAsyncImage: loadAsyncImage,
		isDOMElement: isDOMElement
	};

});
