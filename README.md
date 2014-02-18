# Performlist

Performlist is an HTML5 library for making fast scrolling lists (i.e. a contact list).

Every Mobile Native framework (ObjC, Android SDK...) has a "widget" for displaying content
through a scrolling list. HTML5 didn't had yet... I mean for long scrolling lists that
struggle to be displayed in a browser.
PerformList was first build for "native web" applications, like the ones built with Apache
Cordova. It also generates an automatic touchable index when using items with categories.

[See my presentation (in French) about "native web" feedback](http://experiences-en-web-natif.gopagoda.com)

## Licence

MIT (https://github.com/mysegfault/performlist/blob/master/LICENSE)

## Main features

* Mobile first
* Designed for performance
* Generated automatically an index when used with categories
* AMD ready
* Asynchronious data loading
* SAP (Single Application Page) ready
* CSS / JS non obstructive (so it doesn't break your existing code)
* Use broadcast signal (pub/sub) design
* Compatible with iScroll lists
* Auto resizeable

## Dependencies Bower plugins

* pubsub-js (git://github.com/mroderick/PubSubJS.git)
* js-dom-tools (git://github.com/mysegfault/js-dom-tools)
* requirejs (git://github.com/jrburke/requirejs.git)
* raf.js (git://github.com/ngryman/raf.js.git)
* html5-mobile-boilerplate (git://github.com/h5bp/mobile-boilerplate.git)

Optional (for better browser support like Android 2):
* "html5-polyfills" bower package. (git://github.com/remy/polyfills.git)
** use classList.js

## Install

1. bower install performlist

## How to use it

1. require() the performlist AMD module
2. First instanciate the class (1 instance by list)
3. initialize the performList (and optionally configure it)
3. Set JSON data when list is initialized
⋅⋅1. Simple list items ['a', 'b']
⋅⋅2. List items with category {'French': ['a', 'b'], 'English': ['c', 'd']}

```javascript
require(['perform-list/perform-list', 'pubsub-js/pubsub'], function(PerformList, pubsub) {

	var list = new PerformList();
	list.init();

	pubsub.subscribe('mbs.performlist.initialized.' + list.getId(), function() {
		var items = ['a', 'b'];
		list.setData(items);
	});

});
```

## Examples

[Download](https://github.com/mysegfault/performlist/archive/master.zip) the project and use the "examples" folder that contains a snapshot of all the libraries

Or 

[access directly the performlist examples](https://rawgithub.com/mysegfault/performlist/master/examples/index.html)

## Notes

performlist works with browser native scroll
```CSS
overflow-y: scroll
```
And also work with iScroll lists.

iScroll is recommanded for iOS devices + old Android devices.

Feedback / comments are welcomed !! :D

