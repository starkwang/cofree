import 'reflect-metadata'
import {
    META_BODY,
    META_ROUTE
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

export const Body = () => function (target: Object, propertyKey: string, parameterIndex: number) {
    Reflect.defineMetadata(META_BODY, parameterIndex, target[propertyKey])
}
