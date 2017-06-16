# glob-set

[![NPM version](https://img.shields.io/npm/v/glob-set.svg)](https://www.npmjs.com/package/glob-set)
[![Build Status](https://travis-ci.org/shinnn/glob-set.svg?branch=master)](https://travis-ci.org/shinnn/glob-set)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/glob-set.svg)](https://coveralls.io/github/shinnn/glob-set?branch=master)

Like [node-glob](https://github.com/isaacs/node-glob), but provides results as a [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) instead of an `Array`

```javascript
const globSet = require('glob-set');

globSet('*.js').then(found => {
  found instanceof Set; //=> true
  found; //=> Set {'index.js', 'test.js'}
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install glob-set
```

## API

```javascript
const globSet = require('glob-set');
```

### globSet(*pattern* [, *options*])

*pattern*: `String` ([glob pattern](https://github.com/isaacs/node-glob#glob-primer))  
*options*: `Object` ([`glob` options](https://github.com/isaacs/node-glob#options))  
Return: [`Glob`](https://github.com/isaacs/node-glob#class-globglob) instance with the additional [`Promise` prototype methods](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise#Methods_2)

#### Differences from [`glob`](https://github.com/isaacs/node-glob#globpattern-options-cb)

* Produces the result as a [`Set`](http://www.2ality.com/2015/01/es6-maps-sets.html#set) instance, instead of an array.
* The returned object has an additional methods [`then`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) and [`catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), and will be resolved or rejected just like [`Promise`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise).
* Doesn't support the third `cb` parameter.
* `silent` option and `strict` option default to `true`.
* Synchronous processing is not supported.

```javascript
globSet('*', {cwd: 'node_modules'}).then(found => {
  for (const path of found) {
    console.log(path); // abbrev, acorn, acorn-jsx, ...
  }
}, err => {
  console.error(`An error occurred: ${err.message}`);
});
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
