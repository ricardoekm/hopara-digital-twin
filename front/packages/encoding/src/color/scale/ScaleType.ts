import { isString } from 'lodash/fp'

export enum ColorScaleType {
  GROUPED = 'grouped',
  LINEAR = 'linear',
  SORTED = 'sorted',
  HASHED = 'hashed'
}

export function scaleTypeEquals(a: ColorScaleType, b: ColorScaleType) {
  return (isString(a) && isString(b)) && a.toLowerCase() === b.toLowerCase()
}
