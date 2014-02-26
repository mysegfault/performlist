
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
