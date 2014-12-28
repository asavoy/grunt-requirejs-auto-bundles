'use strict';

var _ = require('lodash');
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

module.exports = {
    convertToAlias: convertToAlias,
    modulePathToId: modulePathToId
};
