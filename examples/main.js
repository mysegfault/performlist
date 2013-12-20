
require.config({
	baseUrl: '/libs'
});

require(['perform-list/perform-list', 'pubsub-js/pubsub'], function(PerformList, pubsub) {

	var list = new PerformList();

	var options = {
		'useFilters': false
	};

	var dataFile = '';
	if (document.location.hash === '#2') {
		dataFile = 'data/contacts-full.json';
		options['useFilters'] = true;
	}
	else {
		dataFile = 'data/simple-text-links.json';
		options['useFilters'] = false;
	}

	list.init(options);
	var id = list.getId();

	var dataRequest = new XMLHttpRequest();
	dataRequest.onreadystatechange = function() {
		if (dataRequest.readyState === 4) {
			if (dataRequest.status === 200) {
				var items = JSON.parse(dataRequest.responseText);
				if (items.length === 0) {
					console.error('could not find any item');
					return;
				}
				items = multiplyData(items, 300);
				
				console.log(items.length);

				pubsub.subscribe('mbs.performlist.initialized.' + id, function() {
					list.setData(items);
				});

				pubsub.subscribe('mbs.performlist.click.' + id, function(msg, data) {
					if (typeof data !== 'object') {
						return;
					}
					if (typeof data.target !== 'object') {
						return;
					}
					var element = data.target.querySelector('span[href]');
					if (element === null) {
						return;
					}
					if (data.target.classList.contains('selected') === true) {
						data.target.classList.remove('selected');
					}
					else {
						data.target.classList.add('selected');
					}
				});
				pubsub.subscribe('mbs.performlist.ready.' + id, function() {

					var isIOS = (window.navigator.userAgent.match(/OS .+_.* like/) !== null);
					var isIOS = true;
					if (isIOS === true) {
						require(['iscroll4/iscroll'], function() {
							var listContainer = document.querySelector('.perform-list-container');
							window.iScrollInst = new iScroll(listContainer);
							pubsub.publish('mbs.performlist.start.' + id);
						});
					}
					else {
						pubsub.publish('mbs.performlist.start.' + id);
					}
				});
			}
			else {
				console.error('Error with AJAX');
			}
		}
	};

	dataRequest.open('GET', dataFile, true);
	dataRequest.send(null);
});

function multiplyData(items, scrollingNumber) {

	function multiplyArray() {
		var _items = [];
		var cpt = 0;
		while (42) {
			for (var i = 0; i < items.length; i++) {
				if (cpt >= scrollingNumber) {
					break;
				}
				var _idxClean = ((cpt + 1) * (i + 1));
				var _item = items[i].replace(/%IDX%/g, _idxClean);
				_items.push(_item);
				cpt++;
			}
			if (cpt >= scrollingNumber) {
				break;
			}
		}
		return _items;
	}

	function multiplyObject() {
		return items;
//		var _items = {};
//		var cpt = 0;
//		while (42) {
//			for (var i in items) {
//				if (cpt >= scrollingNumber) {
//					break;
//				}
//				var _idxClean = ((cpt + 1) * (i + 1));
//				var _item = items[i].replace(/%IDX%/g, _idxClean);
//				_items.push(_item);
//				cpt++;
//			}
//			if (cpt >= scrollingNumber) {
//				break;
//			}
//		}
//		return _items;
	}

	if (items instanceof Array) {
		if (items.length === 0) {
			console.error('could not find any item');
			return [];
		}
		return multiplyArray();
	}
	if (items instanceof Object) {
		return multiplyObject();
	}

	console.error('could not find any item');
	return [];
}
