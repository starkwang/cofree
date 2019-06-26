import 'reflect-metadata'
import {
    META_BODY,
    META_ROUTE,
    META_HEADERS,
    META_REQ,
    META_RES
} from './contants'

export function Get(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(META_ROUTE, {
            path,
            method: 'get'
        }, descriptor.value)
        return descriptor
    }
}

function createRouteDecorator(key) {
    return () => function (target: Object, propertyKey: string, parameterIndex: number) {
        Reflect.defineMetadata(key, parameterIndex, target[propertyKey])
    }
}

export const Body = createRouteDecorator(META_BODY)

export const Headers = createRouteDecorator(META_HEADERS)

export const Req = createRouteDecorator(META_REQ)

export const Res = createRouteDecorator(META_RES)
