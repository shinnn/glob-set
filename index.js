'use strict';

const {Glob} = require('glob');
const GlobOptionError = require('glob-option-error');
const inspectWithKind = require('inspect-with-kind');
const validateGlobOpts = require('validate-glob-opts');

module.exports = function globSet(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		return Promise.reject(new RangeError(`Expected 1 or 2 arguments (<string>[, <Object>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments instead.`));
	}

	const [pattern, options] = args;

	if (typeof pattern !== 'string') {
		return Promise.reject(new TypeError(`Expected a glob pattern (string), but got a non-string value ${
			inspectWithKind(pattern)
		}.`));
	}

	if (argLen === 2) {
		const validationResults = validateGlobOpts(options);

		if (validationResults.length !== 0) {
			return Promise.reject(new GlobOptionError(validationResults));
		}
	}

	let stackedResolve;
	let stackedReject;

	const promise = new Promise((resolve, reject) => {
		stackedResolve = resolve;
		stackedReject = reject;
	});

	const glob = new Glob(pattern, {
		silent: true,
		strict: true,
		...options
	}, (err, found) => {
		if (err) {
			stackedReject(err);
			return;
		}

		stackedResolve(new Set(found));
	});

	glob.then = promise.then.bind(promise);
	glob.catch = promise.catch.bind(promise);

	return glob;
};
