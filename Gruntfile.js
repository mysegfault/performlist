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
		}
	});

	// Dependencies
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task
	grunt.registerTask('default', ['uglify', 'cssmin', 'jshint']);
};
