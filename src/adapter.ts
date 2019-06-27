import * as Router from 'koa-router'
import {
    META_BODY,
    META_ROUTE,
    META_HEADERS,
    META_REQ,
    META_RES
} from './contants'
import * as express from 'express'
const serverless = require('serverless-http')

export function toExpress(application) {
    const app = express()

    application.controllers.forEach(controller => {
        Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
            .filter(name => name !== 'contructor')
            .forEach(name => {
                const metaRoute = Reflect.getMetadata(META_ROUTE, controller[name])
                const metaBody = Reflect.getMetadata(META_BODY, controller[name])
                const metaHeaders = Reflect.getMetadata(META_HEADERS, controller[name])
                const metaReq = Reflect.getMetadata(META_REQ, controller[name])
                const metaRes = Reflect.getMetadata(META_RES, controller[name])
                if (metaRoute) {
                    // 根据签名
                    app[metaRoute.method](metaRoute.path, async (req, res) => {
                        const routeParams = []
                        if (metaBody !== undefined) routeParams[metaBody] = req.body
                        if (metaHeaders !== undefined) routeParams[metaHeaders] = req.headers
                        if (metaReq !== undefined) routeParams[metaReq] = req
                        if (metaRes !== undefined) routeParams[metaRes] = res

                        res.send(await controller[name](...routeParams))
                    })
                }
            })
    })

    return app
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

export function toLambda(application) {
    const expressApp = toExpress(application)
    return serverless(expressApp)
}