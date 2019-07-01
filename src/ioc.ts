import { META_MODULE } from './contants'

export function createApplication(module) {
  const moduleMeta = Reflect.getMetadata(META_MODULE, module)

  const applicationInstance = {
    controllers: []
  }

  const providerInstancePool = new InstancePool()
  moduleMeta.controllers.forEach(controllerConstructor => {
    const controllerConstructorParamsMeta = Reflect.getMetadata(
      'design:paramtypes',
      controllerConstructor
    )
    const controllerContructorParams = []
    controllerConstructorParamsMeta.map(providerConstructor => {
      if (moduleMeta.providers.includes(providerConstructor)) {
        const provider = providerInstancePool.get(providerConstructor)
        controllerContructorParams.push(provider)
      } else {
        throw new Error(`Cannot find provider: ${providerConstructor.name}`)
      }
    })

    applicationInstance.controllers.push(
      new controllerConstructor(...controllerContructorParams)
    )
  })

  return applicationInstance
}

class InstancePool {
  private _pool
  constructor() {
    this._pool = []
  }
  add(instance) {
    this._pool.push(instance)
  }
  get(instanceConstructor) {
    for (let i = 0; i < this._pool.length; i++) {
      const instance = this._pool[i]
      if (instance instanceof instanceConstructor) {
        return instance
      }
    }

    // no instance contained
    const instance = new instanceConstructor()
    this._pool.push(instance)
    return instance
  }
}

// 标记可被注入类
export const Injectable = () => (_constructor: Function) => {
  // 通过反射机制，获取参数类型列表
  let paramsTypes: Function[] = Reflect.getMetadata(
    'design:paramtypes',
    _constructor
  )
  if (paramsTypes.length) {
    paramsTypes.forEach((v, i) => {
      if (v === _constructor) {
        throw new Error('不可以依赖自身')
      }
    })
  }
}
