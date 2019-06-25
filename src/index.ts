import * as Koa from 'koa'

import { toKoaRouter, toScf } from './adapter'
import { Get, Body } from './http'
import { Module, Controller } from './module'
import { Injectable, createModule } from './ioc'

@Injectable()
class FooProvider {
    constructor() { }
    say() {
        return 'hello!'
    }
}

@Controller()
class FooController {
    constructor(
        private readonly fooProvider: FooProvider
    ) {}

    @Get('/')
    async index(@Body() body) {
        return this.fooProvider.say()
    }
}



@Module({
    controllers: [FooController],
    providers: [FooProvider]
})
class AppModule { }

const mod = createModule(AppModule)

console.log(mod)

// toScf(FooController)(0, 1)

var app = new Koa();
app.use(toKoaRouter(FooController))
app.listen(3000);
