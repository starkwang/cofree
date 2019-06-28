import { Get, Body, Headers, Req } from '../src/http'
import { Module, Controller } from '../src/module'
import { Injectable, createApplication } from '../src/ioc'

@Injectable()
class FooProvider {
  constructor() {}
  say() {
    return 'hello! stark!'
  }
}

@Controller()
class FooController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Get('/')
  async index(@Body() body) {
    return this.fooProvider.say()
  }
}

@Controller()
class BarController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Get('/headers')
  async body(@Headers() headers) {
    return JSON.stringify(headers)
  }

  async noRoute() {}
}

@Module({
  controllers: [FooController, BarController],
  providers: [FooProvider],
})
class AppModule {}

export default createApplication(AppModule)
