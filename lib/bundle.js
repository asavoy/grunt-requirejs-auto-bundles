'use strict';

var crypto = require('crypto');

/**
 * Calculate a unique bundle name, given a list of main modules that depend on
 * its contents.
 */
function generateBundleName(mains) {
    // Join mains into a string.
    var joinedMains = mains.sort().join('-');

    // Create hash.
    var hash = crypto.createHash('md5').update(joinedMains).digest('hex');

    // Replace any special chars.
    joinedMains = joinedMains.replace(/\/|\\|\./g, '_');

    // Truncate and append hash.
    var bundleName = joinedMains.slice(0, 16) + '-' + hash.slice(0, 6);
    return bundleName;
}

module.exports = {
    generateBundleName: generateBundleName
};
