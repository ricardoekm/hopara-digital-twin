import {isArray, isObject, isPlainObject} from 'lodash/fp'

export function objectsToString(params: Record<string, any>): Record<string, any> {
  Object.keys(params).forEach((key: string) => {
    if (isPlainObject(params[key])) {
      params[key] = JSON.stringify(params[key])
    } else if (isArray(params[key])) {
      params[key] = params[key].map((item: any) => {
        if (isObject(item)) return JSON.stringify(item)
        return item
      })
    }
  })
  return params
}
