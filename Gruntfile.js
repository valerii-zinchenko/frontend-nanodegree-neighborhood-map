'use strict';

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

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

		copy: {
			dist: {
				files: {
					'dest/index.html': 'src/index_prod.html'
				}
			}
		},

		clean: {
			build: {
				src: ['dest']
			}
		}
	});

	grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'copy']);
};
