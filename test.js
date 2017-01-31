'use strict';

const globSet = require('.');
const test = require('tape');
const unglobbable = require('unglobbable');

test('globSet()', t => {
  t.plan(6);

  globSet('*.js').then(found => {
    t.strictEqual(found.size, 2, 'should be resolved with a Set instance.');
    t.deepEqual([...found], ['index.js', 'test.js'], 'should search files with a glob pattern.');
  });

  globSet('{,*/}*', {nobrace: true}).then(({size}) => {
    t.strictEqual(size, 0, 'should support node-glob options.');
  });

  const fail = t.fail.bind(t, 'Glob unexpectedly succeeded.');

  globSet(unglobbable, {}).then(fail, ({code}) => {
    t.strictEqual(code[0], 'E', 'should fail when node-glob emits an error.');
  });

  globSet(new Uint8Array()).then(fail, ({message}) => {
    t.strictEqual(
      message,
      'Expected a glob pattern (string), but got a non-string value Uint8Array [  ].',
      'should fail when the first argument is not a string.'
    );
  });

  globSet('pattern', {realPathCache: true}).then(fail, ({message}) => {
    t.strictEqual(
      message,
      'node-glob doesn\'t have `realPathCache` option. Probably you meant `realpathCache`.',
      'should fail when it takes invalid glob option.'
    );
  });
});
