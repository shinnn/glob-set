/*!
 * glob-set | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/glob-set
*/
'use strict';

const inspect = require('util').inspect;

const Glob = require('glob').Glob;
const GlobOptionError = require('glob-option-error');
const validateGlobOpts = require('validate-glob-opts');

module.exports = function globSet(pattern, options) {
  if (typeof pattern !== 'string') {
    return Promise.reject(new TypeError(`Expected a glob pattern (string), but got a non-string value ${
      inspect(pattern)
    }.`));
  }

  const validationResults = validateGlobOpts(options);

  if (validationResults.length !== 0) {
    return Promise.reject(new GlobOptionError(validationResults));
  }

  let resolve;
  let reject;

  const promise = new Promise((resolveArg, rejectArg) => {
    resolve = resolveArg;
    reject = rejectArg;
  });

  const glob = new Glob(pattern, Object.assign({
    silent: true,
    strict: true
  }, options), (err, found) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(new Set(found));
  });

  glob.then = promise.then.bind(promise);
  glob.catch = promise.catch.bind(promise);

  return glob;
};
