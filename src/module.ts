import { META_MODULE } from './contants'
export function Module(config) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(META_MODULE, config, constructor)
    return constructor
  }
}

export function Controller() {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return constructor
  }
}

export function Provider() {}
