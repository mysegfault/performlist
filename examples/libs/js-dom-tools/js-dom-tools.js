/*
 * JavaScript DOM tools library
 * 2013-12-20
 *
 * By mysegfault <maxime.alexandre@mobile-spot.com>, https://github.com/mysegfault/js-dom-tools
 * 
 * MIT Licence
 */

define([], function() {

	function loadAsyncScript(src, id, callback) {
		if (typeof src !== 'string') {
			console.error('src parameter is invalid: [' + src + ']');
			return;
		}
		var tag = document.createElement('script');
		tag.src = src;
		tag.async = true;
		if (typeof id === 'string') {
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
		var tag = document.createElement('link');
		tag.rel = 'stylesheet';
		tag.href = src;
		tag.async = true;

		if (typeof callback === 'function') {
			tag.addEventListener("load", function load(event) {
				tag.removeEventListener("load", load, false);
				callback(event);
			}, false);
		}

		document.head.appendChild(tag);
	}

	function findParentNodeWithNodeName(element, nodeName) {
		if (typeof element === 'undefined') {
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

		if (typeof element === 'undefined') {
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

		if (typeof element === 'undefined') {
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
		getItemWidth: getItemWidth
	};
});
