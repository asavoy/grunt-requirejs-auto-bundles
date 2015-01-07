'use strict';

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

exports.autobundles = {
  setUp: function(done) {
    done();
  },
  simple: function(test) {
    test.expect(2);

    test.equal(
        grunt.file.read('tmp/simple/build.txt'),
        grunt.file.read('test/expected/simple/build.txt'),
        'Modules not optimized with shared bundles as expected.'
    );

    test.equal(
        grunt.file.read('tmp/simple/require-config.js'),
        grunt.file.read('test/expected/simple/require-config.js'),
        'Config module should have bundles config injected.'
    );

    test.done();
  }
};
