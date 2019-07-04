import {
  Get,
  Body,
  Headers,
  Req,
  Post,
  FileInterceptor,
  UploadedFile
} from '../src/http'
import { Module, Controller } from '../src/module'
import { Injectable } from '../src/ioc'

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

  @Post('/')
  async postIndex(@Body() body) {
    return body
  }

  @Get('/headers')
  async body(@Headers() headers) {
    return JSON.stringify(headers)
  }

  @Post('/upload')
  @FileInterceptor('avatar')
  async uploadFile(@Body() body, @Req() req, @UploadedFile() file) {
    return {
      ...body,
      fieldname: file.fieldname,
      size: file.size
    }
  }
}

@Controller('bar')
class BarController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Get('/')
  async index(@Body() body) {
    return 'this is bar'
  }

  async noRoute() {}
}

@Module({
  controllers: [FooController, BarController],
  providers: [FooProvider]
})
export default class AppModule {}
