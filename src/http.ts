export function Get(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target, propertyKey, descriptor)
    }
}