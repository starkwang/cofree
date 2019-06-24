import * as Koa from 'koa'

import { Get, toKoaRouter } from './http'

export class FooController {
    @Get('/')
    async index(ctx, next) {
        ctx.body = 'hello'
        next()
    }
}


var app = new Koa();
app.use(toKoaRouter(FooController))
app.listen(3000);
