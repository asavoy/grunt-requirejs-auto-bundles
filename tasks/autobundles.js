'use strict';

var _ = require('lodash');
var bundle = require('../lib/bundle');
var config = require('../lib/config');
var path = require('path');

module.exports = function(grunt) {

    grunt.registerMultiTask(
        'autobundles',
        'Automated shared bundles for grunt-contrib-requirejs builds.',
        function() {

            // Get the target for this task. It should correspond to a target
            // for the requirejs task.
            var target = this.target;

            // Merge task-specific and/or target-specific options with these defaults.
            var options = this.options({
                // Combine bundles until we reach this maximum number of
                // bundles that would be requested by any main module.
                maxBundles: 3,
                // The module ID for the JS file that calls
                // `requirejs.config({ ... })`.
                requireConfigModule: 'require-config'
            });

            // Take the options for the grunt-contrib-requirejs Grunt task.
            var origRequirejsConfig = grunt.config.get('requirejs.' + target + '.options');

            // We want to do a "dry run" build first. That means taking out
            // some slow options & avoid writing if we can.
            var dryRunRequirejsConfig = _.cloneDeep(origRequirejsConfig);
            dryRunRequirejsConfig = _.merge(dryRunRequirejsConfig, {
                optimize: 'none',
                optimizeCss: 'none',
                logLevel: 4
            });

            // Add a done callback, so we can analyse the build.
            dryRunRequirejsConfig = _.merge(dryRunRequirejsConfig, {
                done: function(done, output) {
                    grunt.log.ok('autoBundles dry run completed');
                    // When the build is done, check for duplicated modules
                    // in the build. These should be optimised by putting
                    // into bundles.
                    var duplicates = require('rjs-build-analysis').duplicates(output);

                    // Read the config as set through `requirejs.config()`.
                    var loaderConfigPath = path.normalize(
                        path.join(
                            origRequirejsConfig.appDir,
                            origRequirejsConfig.baseUrl,
                            options.requireConfigModule + '.js'
                        )
                    );
                    var loaderConfig = config.readLoaderConfig(loaderConfigPath);

                    // Calculate bundles from the duplicates.
                    var result = bundle.calculateBundles(
                        origRequirejsConfig.modules, duplicates, loaderConfig, options.maxBundles
                    );

                    // We're going to setup the config for an actual requirejs
                    // task, starting with the original config.
                    var actualRequirejsConfig = _.cloneDeep(origRequirejsConfig);

                    // Add in the bundles and modules.
                    actualRequirejsConfig.modules = result.modules;

                    // Generate the bundles config script.
                    var bundleDependencies = _.mapValues(result.bundles, 'dependencies');
                    var bundleConfigScript = (
                        'requirejs.config({bundles: ' + JSON.stringify(bundleDependencies) + '});\n\n'
                    );

                    // Inject the bundles config script into the config module.
                    var foundRequirejsConfig = false;
                    _.forEach(actualRequirejsConfig.modules, function(module) {
                        if (module.name === options.requireConfigModule) {
                            foundRequirejsConfig = true;
                            if (module.override && module.override.wrap) {
                                grunt.fail.warn('Cannot add wrap: options to ' +
                                    'the requirejs config module, because ' +
                                    'they have already been defined.');
                            }
                            if (!module.override) {
                                module.override = {};
                            }
                            module.override.wrap = {
                                start: bundleConfigScript
                            };
                        }
                    });
                    if (!foundRequirejsConfig) {
                        grunt.fail.warn('Did not find requirejs config ' +
                            'module "' + options.requireConfigModule + '" ' +
                            'in the modules: list.');
                    }

                    // Now set the configuration of the actual requirejs
                    // task, that follows.
                    grunt.config.set('requirejs.' + target + '.options', actualRequirejsConfig);

                    done();
                }
            });

            // Apply the config to the requirejs task.
            grunt.config.set('requirejs.' + target + '.options', dryRunRequirejsConfig);

            // Run the requirejs Grunt task with these options, as a dry run
            // to detect things to bundle.
            grunt.task.run('requirejs:' + target);
        });
};
