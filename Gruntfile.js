/*
 * grunt-requirejs-auto-bundles
 * https://github.com/asavoy/grunt-requirejs-auto-bundles
 *
 * Copyright (c) 2014 Alvin Savoy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        autobundles: {
            simple: {
                options: {}
            }
        },
        requirejs: {
            simple: {
                options: {
                    appDir: 'test/fixtures/simple',
                    baseUrl: './',
                    dir: 'tmp/simple',
                    mainConfigFile: 'test/fixtures/simple/require-config.js',
                    optimize: 'none',
                    keepBuildDir: false,
                    modules: [
                        { name: 'require-config' },
                        { name: 'main_a' },
                        { name: 'main_b' }
                    ]
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'autobundles', 'requirejs', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
