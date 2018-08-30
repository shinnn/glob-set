'use strict';

const globSet = require('.');
const test = require('tape');
const unglobbable = require('unglobbable');

test('globSet()', async t => {
	t.plan(8);

	(async () => {
		const found = await globSet('*.js');

		t.equal(found.size, 2, 'should be resolved with a Set instance.');
		t.deepEqual([...found], ['index.js', 'test.js'], 'should search files with a glob pattern.');
	})();

	(async () => {
		t.equal(
			(await globSet('{,*/}*', {nobrace: true})).size,
			0,
			'should support node-glob options.'
		);
	})();

	const fail = t.fail.bind(t, 'Glob unexpectedly succeeded.');

	try {
		await globSet(unglobbable, {});
		fail();
	} catch ({code}) {
		t.equal(code[0], 'E', 'should fail when node-glob emits an error.');
	}

	try {
		await globSet(new Uint8Array());
		fail();
	} catch ({message}) {
		t.equal(
			message,
			'Expected a glob pattern (string), but got a non-string value Uint8Array [  ].',
			'should fail when the first argument is not a string.'
		);
	}

	try {
		await globSet('pattern', {realPathCache: true});
		fail();
	} catch ({message}) {
		t.equal(
			message,
			'node-glob doesn\'t have `realPathCache` option. Probably you meant `realpathCache`.',
			'should fail when it takes invalid glob option.'
		);
	}

	try {
		await globSet();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (<string>[, <Object>]), but got no arguments instead.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await globSet('1', '2', '3');
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected 1 or 2 arguments (<string>[, <Object>]), but got 3 arguments instead.',
			'should fail when it takes too many arguments.'
		);
	}
});
