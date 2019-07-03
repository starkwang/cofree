import {
  META_BODY,
  META_ROUTE,
  META_HEADERS,
  META_REQ,
  META_RES,
  META_REACT_SSR,
  META_FILE_INTERCEPTOR,
  META_UPLOADED_FILE,
  META_CONTROLLER_PATH
} from './contants'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'
import * as ReactDOMServer from 'react-dom/server'
import * as resolvePathname from 'resolve-pathname'
import { resolvePath } from './utils'
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
    const controllerPath = Reflect.getMetadata(META_CONTROLLER_PATH, controller)
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
          // controller path + route path
          const route = resolvePath(controllerPath, metaRoute.path)
          app[metaRoute.method](route, async (req, res) => {
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

export function toLambda(application) {
  const expressApp = toExpress(application)
  return serverless(expressApp)
}
