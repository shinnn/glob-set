/*!
 * glob-set | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/glob-set
*/
'use strict';

var inspect = require('util').inspect;

var assertValidGlobOpts = require('assert-valid-glob-opts');
var Glob = require('glob').Glob;

module.exports = function globSet(pattern, options) {
  if (typeof pattern !== 'string') {
    return Promise.reject(new TypeError(
      'Expected a glob pattern (string), but got a non-string value ' +
      inspect(pattern) +
      '.'
    ));
  }

  try {
    assertValidGlobOpts(options);
  } catch (err) {
    return Promise.reject(err);
  }

  var resolve;
  var reject;

  var promise = new Promise(function(resolveArg, rejectArg) {
    resolve = resolveArg;
    reject = rejectArg;
  });

  var glob = new Glob(pattern, Object.assign({
    silent: true,
    strict: true
  }, options), function(err, found) {
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
