import { ColorEncoding } from '@hopara/encoding'
import { set as _set, isNil} from 'lodash'

export class VegaColorTranslator {
  set(path:string[], object:any, value:any) {
    if (value) {
      _set(object, path, value)
    }
  }

  getVegaColorEncoding(colorEncoding: ColorEncoding) {
    if (colorEncoding.isFieldBased()) {
      const vegaEncoding = {
          field: colorEncoding.field,
      } as any

      this.set(['scale', 'scheme'], vegaEncoding, colorEncoding.getScale().scheme)
      this.set(['scale', 'range'], vegaEncoding, colorEncoding.getScale().colors)
      this.set(['scale', 'domain'], vegaEncoding, colorEncoding.getScale().values)
      this.set(['scale', 'reverse'], vegaEncoding, colorEncoding.getScale().reverse)

      if ( !isNil(colorEncoding.value) ) {
        vegaEncoding.condition = {
          test: `datum.${colorEncoding.field} === null`,
          value: colorEncoding.value,
        }
      }

      return vegaEncoding
    } else {
      return {
          value: colorEncoding.value,
      }
    }
  }

  translate(colorEncoding?: ColorEncoding) : any {
    if (!colorEncoding) {
      return {}
    }

    return {
      color: this.getVegaColorEncoding(colorEncoding),
      opacity: {
        value: colorEncoding.opacity,
      },
    }
  }
}
