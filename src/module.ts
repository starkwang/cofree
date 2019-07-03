import { META_MODULE, META_CONTROLLER_PATH } from './contants'
export function Module(config) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(META_MODULE, config, constructor)
    return constructor
  }
}

export function Controller(path = '/') {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(META_CONTROLLER_PATH, path, constructor)
    return constructor
  }
}

export function Provider() {}
