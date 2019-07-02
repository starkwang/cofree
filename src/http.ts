import 'reflect-metadata'
import {
  META_BODY,
  META_ROUTE,
  META_HEADERS,
  META_REQ,
  META_RES,
  META_REACT_SSR,
  META_UPLOADED_FILE,
  META_FILE_INTERCEPTOR
} from './contants'

export const Get = createHTTPMethodDecorator('get')
export const Post = createHTTPMethodDecorator('post')
export const Put = createHTTPMethodDecorator('put')
export const Delete = createHTTPMethodDecorator('delete')

export const Body = createRouteDecorator(META_BODY)

export const Headers = createRouteDecorator(META_HEADERS)

export const Req = createRouteDecorator(META_REQ)

export const Res = createRouteDecorator(META_RES)

export const UploadedFile = createRouteDecorator(META_UPLOADED_FILE)

function createHTTPMethodDecorator(method) {
  return (path: string) => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      META_ROUTE,
      {
        path,
        method
      },
      descriptor.value
    )
    return descriptor
  }
}

function createRouteDecorator(key) {
  return () =>
    function(
      target: Record<string, any>,
      propertyKey: string,
      parameterIndex: number
    ) {
      Reflect.defineMetadata(key, parameterIndex, target[propertyKey])
    }
}

export function ReactSSR() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(META_REACT_SSR, true, descriptor.value)
    return descriptor
  }
}

export function FileInterceptor(fieldName) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(META_FILE_INTERCEPTOR, fieldName, descriptor.value)
    return descriptor
  }
}
