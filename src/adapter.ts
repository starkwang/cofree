import * as Router from 'koa-router'
import {
  META_BODY,
  META_ROUTE,
  META_HEADERS,
  META_REQ,
  META_RES,
  META_REACT_SSR,
  META_FILE_INTERCEPTOR,
  META_UPLOADED_FILE
} from './contants'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'
import * as ReactDOMServer from 'react-dom/server'
const serverless = require('serverless-http')

export function toExpress(application) {
  const app = express()
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  const paramCreator = {
    [META_BODY]: req => req.body,
    [META_HEADERS]: req => req.headers,
    [META_REQ]: req => req,
    [META_RES]: (req, res) => res,
    [META_UPLOADED_FILE]: req => req.file
  }

  application.controllers.forEach(controller => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
      .filter(name => name !== 'contructor')
      .forEach(name => {
        const metaRoute = Reflect.getMetadata(META_ROUTE, controller[name])
        const metaReactSSR = Reflect.getMetadata(
          META_REACT_SSR,
          controller[name]
        )
        const metaFileInterceptor = Reflect.getMetadata(
          META_FILE_INTERCEPTOR,
          controller[name]
        )
        if (metaFileInterceptor) {
          app.use(multer().single(metaFileInterceptor))
        }
        if (metaRoute) {
          // 根据签名
          app[metaRoute.method](metaRoute.path, async (req, res) => {
            const routeParams = []
            for (let metaParamKey in paramCreator) {
              const paramIndex = Reflect.getMetadata(
                metaParamKey,
                controller[name]
              )
              if (paramIndex !== undefined) {
                routeParams[paramIndex] = paramCreator[metaParamKey](req, res)
              }
            }

            if (metaReactSSR) {
              res.send(
                ReactDOMServer.renderToString(
                  await controller[name](...routeParams)
                )
              )
            } else {
              res.send(await controller[name](...routeParams))
            }
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
