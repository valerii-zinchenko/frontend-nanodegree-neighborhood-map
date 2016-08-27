'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var fs = require('fs');
	var _ = require('lodash');
	var inline = function(path) {
		var text = fs.readFileSync(__dirname + '/dest/' + path);

		return _.template(text)(this);
	};

	grunt.initConfig({
		uglify: {
			minall: {
				files: {
					'dest/js/app.js': [
						'node_modules/knockout/build/output/knockout-latest.js',
						'node_modules/jquery/dist/jquery.js',
						'src/js/GMap.js',
						'src/js/Wiki.js',
						'src/js/db.js',
						'src/js/models.js',
						'src/js/app.js'
					]
				}
			}
		},

		cssmin: {
			compress: {
				files: {
					'dest/css/styles.css': ['src/css/*.css']
				}
			}
		},

		template: {
			dev: {
				options: {
					data: {
						isDEV: true
					}
				},
				files: {
					'src/index.html': 'src/index_template.html'
				}
			},
			prod: {
				options: {
					data: {
						isDEV: false,
						inline: inline
					}
				},
				files: {
					'dest/index.html': 'src/index_template.html'
				}
			},
		},

		clean: {
			build: {
				src: ['dest']
			}
		}
	});

	grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'template']);
};
