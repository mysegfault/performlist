
define([], function() {

	function loadAsyncScript(src, id) {
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
		document.body.appendChild(tag);
	}

	function loadAsyncCss(src) {
		if (typeof src !== 'string') {
			console.error('src parameter is invalid: [' + src + ']');
			return;
		}
		var tag = document.createElement('link');
		tag.rel = 'stylesheet';
		tag.href = src;
		tag.async = true;
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

	function useDebug(enabled) {
		enabled = (enabled === true);
		if (enabled === true) {
			return console;
		}

		var localConsole = function() {
		};
		localConsole.log = function() {
		};
		localConsole.error = console.error;

		return localConsole;
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

	return {
		loadAsyncScript: loadAsyncScript,
		loadAsyncCss: loadAsyncCss,
		findParentNodeWithNodeName: findParentNodeWithNodeName,
		findParentNodeWithClassName: findParentNodeWithClassName,
		findParentNodeWithAttribute: findParentNodeWithAttribute,
		useDebug: useDebug,
		objectTotalLength: objectTotalLength
	};
});
