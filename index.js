const Transform = require('stream').Transform

/**
 * @param {Function} f The function for performing transform.
 *                     It should have f(chunk: Buffer, enc: string): Buffer or f(chunk: Object): Object signature.
 * @param {Object} opts The options
 * @param {boolean} [opts.objectMode] The flag for object mode.
 */
const makeTransform = (f, opts) => {
  const transform = new Transform({ objectMode: opts.objectMode })

  transform._transform = (chunk, enc, cb) => {
    try {
      Promise.resolve(f(chunk, enc))
        .then(result => cb(null, result))
        .catch(cb)
    } catch (e) {
      cb(e)
    }
  }

  return transform
}

const through1 = f => makeTransform(f, { objectMode: false })
through1.obj = f => makeTransform(f, { objectMode: true })

module.exports = through1
