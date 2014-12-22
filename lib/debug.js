'use strict';

var util = require('util');

/**
 * Inspect an object prettily.
 */
var logInspect = function(obj) {
    console.log(util.inspect(obj, {
        colors: true,
        showHidden: true,
        depth: null
    }));
};

module.exports = {
    logInspect: logInspect
};
