import { Get, ReactSSR } from '../src/http'
import { Module, Controller } from '../src/module'
import { createApplication } from '../src/ioc'
import * as React from 'react'

@Controller()
class FooController {
  constructor() {}

  @Get('/')
  @ReactSSR()
  async index() {
    return (
        <div>Hello World!</div>
    )
  }
}

@Module({
  controllers: [FooController]
})
class AppModule {}

const application = createApplication(AppModule)


import { toExpress } from '../src/adapter'
import * as request from 'supertest'
import * as assert from 'assert'

const expressApp = toExpress(application)

describe('Express with React SSR', function() {
  it('should listen for 3000', async function() {
    const res = await request(expressApp)
      .get('/')
      .expect(200)
    assert.strictEqual(res.text, '<div data-reactroot="">Hello World!</div>')
  })
})

