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

  it('responds with json', async function() {
    const data = { name: 'stark' }
    const res = await request(expressApp)
      .post('/')
      .set('Accept', 'application/json')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(200)
    assert.strictEqual(res.text, JSON.stringify(data))
  })

  it('accept multipart/form-data', async function() {
    const res = await request(expressApp)
      .post('/upload')
      .field('name', 'my awesome avatar')
      .attach('avatar', './test/avatar.png')
      .expect(200)

    assert.deepStrictEqual(res.body, {
      name: 'my awesome avatar',
      fieldname: 'avatar',
      size: 222255
    })
  })
})
