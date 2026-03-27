import { isNil, isString } from 'lodash'
import {get} from 'lodash/fp'

export function geti(key:string | number | undefined | null, object) {
  if (isNil(key)) return
  if (isString(key) && key.includes('.')) {
    return get(key, object)
  }

  for (const candidateKey in object) {
    if (candidateKey.toString().toLowerCase() === key.toString().toLowerCase()) {
      return object[candidateKey]
    }
  }
  return
}
