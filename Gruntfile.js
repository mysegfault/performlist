/* global module:false */
var banner = '/* \n * <%= pkg.name %>: <%= pkg.description %> \n * v<%= pkg.version %> \n * \n * By <%= pkg.authors %>, <%= pkg.homepage %> \n * <%= pkg.license %> Licence \n * \n */\n';

module.exports = function(grunt) {
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: banner,
				report: 'min',
				beautify: false,
				compress: true,
				mangle: true
			},
			min: {
				files: [{
						cwd: 'src/',
						src: ['*.js', '!*.min.js'],
						dest: 'dist/',
						expand: true,
						flatten: true
					}]
			}
		},
		cssmin: {
			options: {
				banner: banner
			},
			combine: {
				files: [{
						cwd: 'src/',
						src: ['*.css', '!*.min.css'],
						dest: 'dist/',
						expand: true,
						ext: '.css'
					}]
			}
		},
		jshint: {
			all: ['src/*.js']
		},
		copy: {
			libs_perform_list: {
				expand: true,
				cwd: 'dist/',
				src: '*',
				dest: 'examples/libs/perform-list/'
			},
			libs_iscroll: {
				expand: true,
				cwd: 'bower_components/iscroll/build',
				src: '*',
				dest: 'examples/libs/iscroll/'
			},
			libs_js_dom_tools: {
				expand: true,
				cwd: 'bower_components/js-dom-tools/src/',
				src: 'js-dom-tools.js',
				dest: 'examples/libs/js-dom-tools/'
			},
			libs_pubsub_js: {
				expand: true,
				cwd: 'bower_components/pubsub-js/src/',
				src: 'pubsub.js',
				dest: 'examples/libs/pubsub-js/'
			},
			libs_requirejs: {
				expand: true,
				cwd: 'bower_components/requirejs/',
				src: 'require.js',
				dest: 'examples/libs/require/'
			}
		}
	});

	// Dependencies
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task
	grunt.registerTask('default', ['uglify', 'cssmin', 'jshint', 'copy']);
};
