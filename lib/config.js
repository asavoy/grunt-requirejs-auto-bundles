'use strict';

var _ = require('lodash');
var fs = require('fs');

/**
 * Given the path to a file that calls `requirejs.config()`, returns the
 * configuration hash.
 */
var readLoaderConfig = function(path) {
    var config = {};
    var requirejs = function() {};
    requirejs.config = function(newConfig) {
        // Merge each config call into the config hash.
        config = _.merge(config, newConfig);
    };
    var require = requirejs;
    var define = requirejs;
    eval(fs.readFileSync(path) + '');
    return config;
};

module.exports = {
    readLoaderConfig: readLoaderConfig
};
