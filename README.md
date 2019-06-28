# Tera

A Node.js Server Framework for Cloud

- Typescript ✔️
- IoC ✔️
- Easy Testing ✔️
- HTTP Server ✔️
- Serverless Function ✔️

# Quick Start

```ts
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

const application = createApplication(AppModule)
```

## Create HTTP Server

```ts
import { toExpress } from '../src/adapter'
const expressApp = toExpress(application)
expressApp.listen(3000)
```

## Create Lambda

```ts
import { toLambda } from '../src/adapter'
export const handler = toLambda(application)
```
