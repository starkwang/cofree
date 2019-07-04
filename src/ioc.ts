import { META_MODULE, META_CONTROLLER_PATH } from './contants'

interface moduleMeta {
  providers?: Function[]
  controllers: (new (...args: any[]) => any)[]
  imports?: Function[]
  exports?: Function[]
}

export async function createApplication(module) {
  const moduleMeta: moduleMeta = Reflect.getMetadata(META_MODULE, module)

  const applicationInstance = {
    controllers: []
  }

  // collect providers
  const providerInstancePool = new InstancePool()
  collectProvider(module, providerInstancePool)
  if (moduleMeta.providers && moduleMeta.providers.length > 0) {
    moduleMeta.providers.forEach(provider => {
      providerInstancePool.add(provider)
    })
  }

  // create controller instance in root module
  moduleMeta.controllers.forEach(controllerConstructor => {
    const controllerConstructorParamsMeta = Reflect.getMetadata(
      'design:paramtypes',
      controllerConstructor
    )
    const controllerContructorParams = []
    controllerConstructorParamsMeta.map(providerConstructor => {
      if (providerInstancePool.contains(providerConstructor)) {
        const provider = providerInstancePool.get(providerConstructor)
        controllerContructorParams.push(provider)
      } else {
        throw new Error(`Cannot find provider: ${providerConstructor.name}`)
      }
    })
    const controllerInstance = new controllerConstructor(
      ...controllerContructorParams
    )

    const controllerPath = Reflect.getMetadata(
      META_CONTROLLER_PATH,
      controllerConstructor
    )
    Reflect.defineMetadata(
      META_CONTROLLER_PATH,
      controllerPath,
      controllerInstance
    )
    applicationInstance.controllers.push(controllerInstance)
  })

  return applicationInstance
}

function collectProvider(module, providerInstancePool: InstancePool) {
  const moduleMeta: moduleMeta = Reflect.getMetadata(META_MODULE, module)

  if (moduleMeta.imports && moduleMeta.imports.length > 0) {
    moduleMeta.imports.forEach(importedModule => {
      collectProvider(importedModule, providerInstancePool)
    })
  }

  if (moduleMeta.exports && moduleMeta.exports.length > 0) {
    moduleMeta.exports.forEach(exportedProvider => {
      if (
        (moduleMeta.providers &&
          moduleMeta.providers.includes(exportedProvider)) ||
        providerInstancePool.contains(exportedProvider)
      ) {
        providerInstancePool.add(exportedProvider)
      } else {
        throw new Error(
          `Exported provider is not found: ${exportedProvider.name}`
        )
      }
    })
  }
}

class InstancePool {
  private _pool
  constructor() {
    this._pool = []
  }
  add(instanceConstructor) {
    const instance = new instanceConstructor()
    this._pool.push(instance)
    return instance
  }
  get(instanceConstructor) {
    for (let i = 0; i < this._pool.length; i++) {
      const instance = this._pool[i]
      if (instance instanceof instanceConstructor) {
        return instance
      }
    }
    return this.add(instanceConstructor)
  }
  contains(instanceConstructor) {
    for (let i = 0; i < this._pool.length; i++) {
      const instance = this._pool[i]
      if (instance instanceof instanceConstructor) {
        return true
      }
    }
    return false
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
