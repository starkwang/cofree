# Cofree

A Node.js Server Framework for Cloud

[![Build Status](https://travis-ci.org/starkwang/cofree.svg?branch=master)](https://travis-ci.org/starkwang/cofree)

- Typescript ✔️
- IoC ✔️
- Easy Testing ✔️

Support:

- HTTP Server ✔️
- Serverless Function ✔️
- Server Side Rendering ✔️

# Quick Start

```tsx
import {
  Get,
  Post,
  FileInterceptor,
  Body,
  Headers,
  Req,
  ReactSSR,
  UploadedFile
} from '../src/http'
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

  @Get('/react-ssr')
  @ReactSSR()
  async reactSSR() {
    return <div>Hello World!</div>
  }

  @Post('/upload')
  @FileInterceptor('file')
  async upload(@UploadedFile() file) {
    return file.size
  }

  async noRoute() {}
}

@Module({
  controllers: [FooController, BarController],
  providers: [FooProvider]
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

# TODO

- More decorators
- Test mock
- Implement my own Request and Response
- Remove serverless-http in lambda adapter
- Guards
