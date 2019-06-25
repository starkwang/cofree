import { META_MODULE } from "./contants";


export function createModule(module) {
    const moduleMeta = Reflect.getMetadata(META_MODULE, module)
    console.log(moduleMeta)

    const moduleInstance = {
        controllers: []
    }
    moduleMeta.controllers.forEach(ctrl => {
        const constructorParamsMeta = Reflect.getMetadata('design:paramtypes', ctrl)
        const params = []
        constructorParamsMeta.map(providerConstructor => {
            const index = moduleMeta.providers.indexOf(providerConstructor)
            if (index >= 0) {
                params.push(new providerConstructor())
            } else {
                throw new Error(`Cannot find provider: ${providerConstructor.name}`)
            }
        })

        moduleInstance.controllers.push(new ctrl(...params))
    })

    return moduleInstance
}

// 标记可被注入类
export const Injectable = () => (_constructor: Function) => {
    // 通过反射机制，获取参数类型列表
    let paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    if (paramsTypes.length) {
        paramsTypes.forEach((v, i) => {
            if (v === _constructor) {
                throw new Error('不可以依赖自身');
            }
        });
    }
}