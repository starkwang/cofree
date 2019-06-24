import 'reflect-metadata'
import * as Router from 'koa-router'
const META_ROUTE = 'META_ROUTE'
export function Get(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(META_ROUTE, {
            path,
            method: 'get'
        }, descriptor.value)
        return descriptor
    }
}

export function toKoaRouter(controller) {
    const instance = new controller()
    const router = new Router()

    const instancePrototype = Object.getPrototypeOf(instance)
    Object.getOwnPropertyNames(instancePrototype)
        .filter(name => name !== 'constructor')
        .forEach(name => {
            const meta = Reflect.getOwnMetadata(META_ROUTE, instancePrototype[name])
            router[meta.method](meta.path, instancePrototype[name])
        })
    return router.routes()
}

export function toScf() {

}