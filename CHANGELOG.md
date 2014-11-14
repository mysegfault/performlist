
# v0.2.4

* Remove libs dependencies we never really use (raf.js + tweenjs)
* Use a more practical way to define / require the performlist packages (see examples)

# v0.2.3

* remove potential JS error

# v0.2.2

* fix scrolling to 0 when setting new data

# v0.2.1

* fix when setting a new data for the list: scrolling didn't stop when selecting a letter

# v0.2.0

* can set content list multiple times with the same list (!)
* disable optimizer by default (not needed)
* fix when using default value for minItemsForFilters

# v0.1.14

* Fix when sliding on letters on Windows Phone

# v0.1.13

* Fix for some Android devices when letters didn't display correctly
* Cleanup code

# v0.1.12

* Remove dependency to "html5-mobile-boilerplate" project, which is no more a bower project
  So you need to download it 'by hand' for now

# v0.1.11

* Do not set a limit of minimum items without showing the letters but make it configurable
* Do not mix click and touch(start/move/end) events
* Do not preventDefault() touchstart (was here because of an Android Default Browser bug, but does not really fix it)
* Comment unused code
* Disable 3D animation for Android Stock Browser because the perf is really bad with this browser

# v0.1.10

* trigger a 'resize' event callback call to initialize the list + selector height
* add an option : a max item size where selectors are not displayed (because the list is too small so we don't need the selectors)

# v0.1.9

* Remove jsdomtools.useDebug() because this sometimes falls on iOS (?)

# v0.1.8

* Move the background color into the main parent element (feels slugish otherwise)
* Make the selectors appears faster

# v0.1.7

* Make sure we can only start the performlist once
* on stop() remove all events launched at start()
* Use another polyfill for using DOM classList feature
* Compress more "dist" files
* Update documentation

# v0.1.6

* Remove selector opacity animation (no meaning for animation)

# v0.1.5

* Fix JS error when calculating selector offset

# v0.1.4

* Add iScroll 4 / 5 support + examples

# v0.1.3
# v0.1.2
# v0.1.1
# v0.1.0

* Inital import
