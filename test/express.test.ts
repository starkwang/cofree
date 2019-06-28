import { toExpress } from '../src/adapter'
import * as request from 'supertest'
import * as assert from 'assert'
import application from './app'

const expressApp = toExpress(application)

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})

describe('Adapter for express', function() {
  it('should listen for 3000', async function() {
    const res = await request(expressApp)
      .get('/')
      .expect(200)
    assert.strictEqual(res.text, 'hello! stark!')
  })

  it('should return headers', async function() {
    const res = await request(expressApp)
      .get('/headers')
      .expect(200)
    assert(res.text.includes('accept-encoding'))
  })
})
