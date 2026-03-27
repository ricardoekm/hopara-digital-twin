import {SizeEncoding} from '@hopara/encoding'

export class VegaRadiusTranslator {
  translate(sizeEncoding?: SizeEncoding) {
    if (!sizeEncoding) {
      return {}
    }
    if (sizeEncoding.field) {
      return {
        radius: {
          field: sizeEncoding.field,
        },
        radius2: {value: 0},
      }
    }
    return {
      radius: {
        value: {
          expr: `min(width, height)/2*${sizeEncoding.getRenderValue() / 100}`,
        },
      },
      radius2: {value: 0},
    }
  }
}
