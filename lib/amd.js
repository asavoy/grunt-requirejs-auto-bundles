'use strict';

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

module.exports = {
    modulePathToId: modulePathToId
};
