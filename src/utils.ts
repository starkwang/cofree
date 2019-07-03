import * as path from 'path'
export function resolvePath(...paths) {
  return path.normalize('/' + paths.join('/'))
}
