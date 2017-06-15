'use strict';

const globSet = require('.');
const test = require('tape');
const unglobbable = require('unglobbable');

test('globSet()', t => {
  t.plan(8);

  globSet('*.js').then(found => {
    t.equal(found.size, 2, 'should be resolved with a Set instance.');
    t.deepEqual([...found], ['index.js', 'test.js'], 'should search files with a glob pattern.');
  });

  globSet('{,*/}*', {nobrace: true}).then(({size}) => {
    t.equal(size, 0, 'should support node-glob options.');
  });

  const fail = t.fail.bind(t, 'Glob unexpectedly succeeded.');

  globSet(unglobbable, {}).then(fail, ({code}) => {
    t.equal(code[0], 'E', 'should fail when node-glob emits an error.');
  });

  globSet(new Uint8Array()).then(fail, ({message}) => {
    t.equal(
      message,
      'Expected a glob pattern (string), but got a non-string value Uint8Array [  ].',
      'should fail when the first argument is not a string.'
    );
  });

  globSet('pattern', {realPathCache: true}).then(fail, ({message}) => {
    t.equal(
      message,
      'node-glob doesn\'t have `realPathCache` option. Probably you meant `realpathCache`.',
      'should fail when it takes invalid glob option.'
    );
  });

  globSet().then(fail, err => {
    t.equal(
      err.toString(),
      'RangeError: Expected 1 or 2 arguments (<string>[, <Object>]), but got no arguments instead.',
      'should fail when it takes no arguments.'
    );
  });

  globSet('1', '2', '3').then(fail, err => {
    t.strictEqual(
      err.toString(),
      'RangeError: Expected 1 or 2 arguments (<string>[, <Object>]), but got 3 arguments instead.',
      'should fail when it takes too many arguments.'
    );
  });
});
