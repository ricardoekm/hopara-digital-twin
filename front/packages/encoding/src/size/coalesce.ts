import { isNil } from 'lodash'

export function coalesce(value1: number | undefined, value2: number | undefined) {
  if ( !isNil(value1) ) {
    return value1
  }

  return value2
}
