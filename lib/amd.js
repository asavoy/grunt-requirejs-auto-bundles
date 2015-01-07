'use strict';

var _ = require('lodash');
var fs = require('fs');

/**
 * Convert a module path into a module ID.
 */
function modulePathToId(path) {
    // We can only transform if there's no plugin used.
    if (path.indexOf('!') === -1) {
        // If it ends with ".js", chop it off.
        var extension = '.js'
        if (path.slice(-extension.length) === '.js') {
            path = path.slice(0, path.length - extension.length);
        }
    }
    return path;
}

/**
 * Converts a module path to the alias used - the reverse mapping of the
 * `paths:` setting in RequireJS configuration.
 */
function convertToAlias(id, paths) {
    var invertedPaths = _.invert(paths);
    if (invertedPaths[id]) {
        return invertedPaths[id];
    }
    else {
        return id;
    }
}

/**
 * Returns the size of a module given its ID.
 * At best this can be considered an estimate because it will return the
 * size before compression, and doesn't take into consideration the effect
 * of plugins.
 * If the module cannot be resolved to a file, returns null.
 */
function moduleSize(id, paths) {
    var path = id;
    var extension = '.js';
    // Use `paths:` to resolve an alias.
    if (paths[id]) {
        path = paths[id];
    }
    // Does the dependency reference a plugin?
    if (path.indexOf('!') !== -1) {
        // Split into plugin and path.
        var pathParts = path.split('!');
        // Often, the plugin maps to the extension it handles.
        extension = '.' + pathParts[0];
        path = pathParts[1];
    }
    // Try to get the file at the path.
    var stats;
    try {
        stats = fs.statSync(path);
        return stats['size'];
    }
    catch(e) {}

    // Didn't find it? Let's try again with the extension added.
    if (path.slice(-extension.length) !== extension) {
        path = path + extension;
    }
    try {
        stats = fs.statSync(path);
        return stats['size'];
    }
    catch(e) {}

    // Still didn't find the file.
    return null;
}

module.exports = {
    convertToAlias: convertToAlias,
    modulePathToId: modulePathToId,
    moduleSize: moduleSize
};
