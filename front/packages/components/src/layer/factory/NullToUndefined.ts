import { isArray, isObject, mapValues } from 'lodash'

export function nullToUndefined(obj) {
  if (isArray(obj)) {
    return obj.map(nullToUndefined)
  }

  if (isObject(obj)) {
    return mapValues(obj, nullToUndefined)
  }

  return obj === null ? undefined : obj
}
