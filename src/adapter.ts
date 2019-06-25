import * as Router from 'koa-router'
import {
    META_BODY,
    META_ROUTE
} from './contants'

export function toExpressApp(controller) {

}

export function toKoaRouter(controller) {
    const instance = new controller()
    const router = new Router()

    const instancePrototype = Object.getPrototypeOf(instance)
    Object.getOwnPropertyNames(instancePrototype)
        .filter(name => name !== 'constructor')
        .forEach(name => {
            const handler = instancePrototype[name]

            const metaBody = Reflect.getOwnMetadata(META_BODY, handler)

            const { method, path } = Reflect.getOwnMetadata(META_ROUTE, handler)

            const parameters = []
            router[method](path, async (ctx, next) => {
                // todo: metaBody 转真正的 body
                ctx.body = await handler(...parameters)
                next()
            })
        })
    return router.routes()
}

export function toScf(controller) {
    const instance = new controller()

    const instancePrototype = Object.getPrototypeOf(instance)
    const map = Object.getOwnPropertyNames(instancePrototype)
        .filter(name => name !== 'constructor')
        .map(name => {
            const handler = instancePrototype[name]

            const metaBody = Reflect.getOwnMetadata(META_BODY, handler)

            const metaRoute = Reflect.getOwnMetadata(META_ROUTE, handler)

            return {
                metaRoute,
                metaBody,
                handler
            }
        })
    return function (events, context) {
        console.log(map)
        // todo: 根据map转换参数
    }
}