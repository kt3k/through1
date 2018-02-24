const { describe, context, it } = require('kocha')

const crypto = require('crypto')
const bl = require('bl')
const assert = require('assert')
const through1 = require('./')

describe('through1', () => {
  context('with synchronous function', () => {
    it('creates a 1 to 1 transform of byte stream', done => {
      let c = 97 // a

      const th1 = through1((chunk, enc) => {
        const buffer = Buffer.alloc(chunk.length)

        chunk.forEach((byte, i) => {
          buffer[i] = c
        })

        c++

        return buffer
      })

      th1.pipe(bl((err, b) => {
        if (err) { done(err) }
        assert.strictEqual(b.toString(), 'aaaaaaaaaabbbbbcccccccccc')
        done()
      }))

      th1.write(crypto.randomBytes(10))
      th1.write(crypto.randomBytes(5))
      th1.write(crypto.randomBytes(10))
      th1.end()
    })
  })

  context('with asynchronous function', () => {
    it('creates a 1 to 1 transform of byte stream', done => {
      let c = 97 // a

      const th1 = through1((chunk, enc) => {
        const buffer = Buffer.alloc(chunk.length)

        chunk.forEach((byte, i) => {
          buffer[i] = c
        })

        c++

        return new Promise(resolve => {
          setTimeout(() => resolve(buffer), 100)
        })
      })

      th1.pipe(bl((err, b) => {
        if (err) { done(err) }
        assert.strictEqual(b.toString(), 'aaaaaaaaaabbbbbcccccccccc')
        done()
      }))

      th1.write(crypto.randomBytes(10))
      th1.write(crypto.randomBytes(5))
      th1.write(crypto.randomBytes(10))
      th1.end()
    })
  })

  describe('.obj', () => {
    context('with synchronous function', () => {
      it('creates a 1 to 1 transform of object stream', done => {
        const data = []

        const th1 = through1.obj(obj => {
          return Object.assign(obj, { foo: `hello ${obj.a}` })
        })

        th1.write({ a: 1 })
        th1.write({ a: 2 })
        th1.write({ a: 3 })
        th1.end()

        th1.on('data', d => data.push(d))

        th1.on('end', () => {
          assert.deepStrictEqual(data, [
            { a: 1, foo: 'hello 1' },
            { a: 2, foo: 'hello 2' },
            { a: 3, foo: 'hello 3' }
          ])
          done()
        })
      })

      it('emits error event when the give function throws', done => {
        const error = new Error()
        const th1 = through1.obj(() => { throw error })

        th1.on('error', e => {
          assert.strictEqual(e, error)
          done()
        })

        th1.write({})
      })
    })

    context('with asynchronous function', () => {
      it('creates a 1 to 1 transform of object stream', done => {
        const data = []

        const th1 = through1.obj(obj => {
          return new Promise(resolve => {
            setTimeout(() => resolve(Object.assign(obj, { foo: `hello ${obj.a}` })), 100)
          })
        })

        th1.write({ a: 1 })
        th1.write({ a: 2 })
        th1.write({ a: 3 })
        th1.end()

        th1.on('data', d => data.push(d))

        th1.on('end', () => {
          assert.deepStrictEqual(data, [
            { a: 1, foo: 'hello 1' },
            { a: 2, foo: 'hello 2' },
            { a: 3, foo: 'hello 3' }
          ])
          done()
        })
      })

      it('emits error event when the promise rejected', done => {
        const error = new Error()
        const th1 = through1.obj(() => Promise.reject(error))

        th1.on('error', e => {
          assert.deepStrictEqual(e, error)
          done()
        })

        th1.write({})
      })
    })
  })
})
