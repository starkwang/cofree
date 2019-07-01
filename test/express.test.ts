import { toExpress } from '../src/adapter'
import * as request from 'supertest'
import * as assert from 'assert'
import application from './app'

const expressApp = toExpress(application)

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
