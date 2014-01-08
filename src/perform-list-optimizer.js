define(['html5-mobile-boilerplate/helper', 'pubsub-js/pubsub', 'js-dom-tools/js-dom-tools'], function(helper, pubsub, jsDomTools) {
	'use strict';
	
	var Optimizer = function() {
		var that = this;

		that._options = {
			maxItemsMatrix: {
				'ios6': 500,
				'android4_0': 500,
				'android4_1': 500,
				'android4_2': 500
			},
			end: ''
		};

		that._vars = {
			listElement: null,
			scrollerElement: null,
			listItems: null,
			htmls: {},
			maxItems: 3000,
			id: 0,
			end: ''
		};

	};

	Optimizer.prototype.init = function(options) {
		var that = this;

		that._vars.listElement = options.listElement;
		that._vars.listItems = options.listItems;
		that._vars.id = options.id;

		pubsub.subscribe('mbs.performlist.start.' + that._vars.id, function() {
			that.start();
		});
	};

	Optimizer.prototype.start = function() {
		//console.log('STARTTTTT');
	};

	Optimizer.prototype.stop = function() {
		//console.log('STOPPPPPPP');

		// TODO: add removeEventListeners !
	};

	Optimizer.prototype.loadFromElement = function(scrollerElement) {
		var that = this;

		that._vars.scrollerElement = scrollerElement;
		this._automaticMaxItemsSelection();
		this._loadFrom(0);
	};

	// PRIVATE METHODS //
	Optimizer.prototype._automaticMaxItemsSelection = function() {
		var that = this;

		var _isIOS6 = window.navigator.userAgent.match(/OS 6_.* like/) !== null;
		if (_isIOS6 === true) {
			that._vars.maxItems = that._options.maxItemsMatrix.ios6;
			return;
		}

		var _isIOS7 = window.navigator.userAgent.match(/OS 7_.* like/) !== null;
		if (_isIOS7 === true) {
			// leave default
			return;
		}

		var _isAndroid4_0 = window.navigator.userAgent.match(/Android 4\.0/) !== null;
		if (_isAndroid4_0 === true) {
			that._vars.maxItems = that._options.maxItemsMatrix.android4_0;
			return;
		}

		var _isAndroid4_1 = window.navigator.userAgent.match(/Android 4\.1/) !== null;
		if (_isAndroid4_1 === true) {
			that._vars.maxItems = that._options.maxItemsMatrix.android4_1;
			return;
		}

		var _isAndroid4_2 = window.navigator.userAgent.match(/Android 4\.2/) !== null;
		if (_isAndroid4_2 === true) {
			that._vars.maxItems = that._options.maxItemsMatrix.android4_2;
			return;
		}

	};

	Optimizer.prototype._loadFrom = function(offset, reverse) {
		reverse = (reverse === true);
		if (typeof offset !== 'number') {
			offset = 0;
		}

		var that = this;
		var listItemNode;
		
		that._vars.scrollerElement.innerHTML = '';

		if (offset < 0) {
			offset = 0;
		}

		if (offset > 0) {
			listItemNode = document.createElement('div');
			listItemNode.innerHTML = 'Click for PREVIOUS';
			listItemNode.classList.add('text-centered');
			listItemNode.style.padding = '20px';

			new MBP.fastButton(listItemNode, function() {
				that._loadFrom(offset - that._vars.maxItems, true);
			});
			listItemNode.classList.add('cursor-pointer');
			that._vars.scrollerElement.appendChild(listItemNode);
		}

		for (var i = offset; i < (that._vars.maxItems + offset); i++) {
			if (typeof that._vars.listItems[i] === 'undefined') {
				break;
			}
			listItemNode = that._vars.listItems[i];
			that._vars.scrollerElement.appendChild(listItemNode);
		}

		if (typeof that._vars.listItems[i] !== 'undefined') {
			listItemNode = document.createElement('div');
			listItemNode.setAttribute('is-loader', i);
			listItemNode.innerHTML = 'Click for NEXT';
			listItemNode.style.padding = '20px';
			listItemNode.classList.add('text-centered');
			new MBP.fastButton(listItemNode, function() {
				that._loadFrom(i);
			});
			listItemNode.classList.add('cursor-pointer');
			that._vars.scrollerElement.appendChild(listItemNode);
		}

		pubsub.publish('mbs.performlist.ready.' + that._vars.id);

		setTimeout(function() {
			that._vars.scrollerElement.scrollIntoView(!reverse);
		}, 10);
	};

	return Optimizer;
});
