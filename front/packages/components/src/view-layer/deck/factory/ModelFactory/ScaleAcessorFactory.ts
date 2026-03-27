import { Rows } from '@hopara/dataset'
import { SizeEncoding, getSizeAccessor } from '@hopara/encoding'

export class ScaleAccessorFactory {
  static create(rows: Rows, sizeEncoding?: SizeEncoding, factor = 1) {
    const sizeAccessor = getSizeAccessor(
      rows,
      sizeEncoding,
    ) || 1

    return (row) => {
      let size = sizeAccessor
      if (typeof size === 'function') size = size(row)
      return [size * factor, size * factor, size * factor]
    }
  }
}
