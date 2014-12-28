'use strict';

var amd = require('../lib/amd');
var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.amd = {
  setUp: function(done) {
    done();
  },
  moduleSizeWhenSimpleModule: function(test) {
    test.expect(1);

    var size = amd.moduleSize('test/fixtures/simple/main_a', {});
    test.equal(size, 96, 'Should get file size given module ID');

    test.done();
  },
  moduleSizeWhenModuleReferencesPlugin: function(test) {
    test.expect(1);

    var size = amd.moduleSize('specialplugin!test/fixtures/simple/main_a.js', {});
    test.equal(size, 96, 'Should get file size given module ID with plugin reference');

    test.done();
  },
  moduleSizeWhenModuleNotFound: function(test) {
    test.expect(1);

    var size = amd.moduleSize('a/file/that/doesnot/exist', {});
    test.equal(size, null, 'Should return null if cannot locate module');

    test.done();
  }
};
