# :one::aquarius::one: through1 v1.0.1

[![CircleCI](https://circleci.com/gh/kt3k/through1.svg?style=svg)](https://circleci.com/gh/kt3k/through1)
[![codecov](https://codecov.io/gh/kt3k/through1/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/through1)

> A simple utility for creating 1 to 1 transform stream.

# :cd: Install

Via npm:

    npm i through1

# Motivation

In the the most use cases, transforms are 1 to 1 transform, which means that it generates one output for each input. The official transform constructor is too complex for this usage. It has the following signature:

```js
new Transform({
  transform (chunk, enc, cb) {
    ...
  }
})
```

This supports one to N transform, where N is 0, 1, 2, or any arbitrary positive integer. This is too much for 1 to 1 transform.

`through1` provides simpler interface for creating 1 to 1 transform.

# :memo: Usage

```js
const through1 = require('through1')
```

If you transform the input **synchronously**, then return the transformed output:

```js
// byte stream
// synchronous transform
through1((chunk, enc) => myTransformFunc(chunk, enc))
```

If you work on the **object mode** stream (for example, like [gulp][]'s stream), then use `.obj` shorthand:

```js
// object stream
// synchronous transform
through1.obj(file => myTransformFunc(func))
```

## Asynchronous use case

If your transformation is asynchronous, then return the promise:

```js
// byte stream
// asynchronous transform
through1((chunk, enc) => myTransformPromise(chunk, enc))
```

If you work on **object mode**:

```js
// object stream
// asynchronous transform
through1.obj(file => myTransformPromise(file))
```

# Comparison

|                         | through1 | [map-stream][] | [gulp-map][]
|-------------------------|----------|----------------|--------------
| object mode support     | ✅        | ✅              | ✅
| non object mode support | ✅        | ✅              | ❌
| promise support         | ✅        | ❌              | ✅
| stream version          | stream 2 | stream 1       | stream 2
| back-pressure support   | ✅        | ❌              | ✅
| dependencies            | 0        | 0              | [9](https://gist.github.com/kt3k/4cab6a63514381027f47046572d8d7ec)

# License

MIT

[through2]: https://npm.im/through2
[gulp]: https://npm.im/gulp
[map-stream]: https://npm.im/map-stream
[gulp-map]: https://npm.im/gulp-map
