import Case from 'case'
import Ajv from 'ajv'
import clone from 'lodash/fp/clone.js'
import {getSchema, sanitizeSymbol} from '../../schema/schema-repository.js'
import {EncodingName} from './Encoding.js'
import LayerImpl from '../../layer/domain/LayerImpl.js'
import {SizeEncodingImpl} from './impl/SizeEncodingImpl.js'
import {ColorEncodingImpl} from './impl/ColorEncodingImpl.js'
import {PolygonEncodingImpl} from './impl/PolygonEncodingImpl.js'
import {OffsetEncodingImpl} from './impl/OffsetEncodingImpl.js'

export interface EncodingFactory<T> {
  create(encoding: Partial<T> | undefined, layer: LayerImpl, setDefault?: boolean): T | undefined
}

class SizeEncodingFactory implements EncodingFactory<SizeEncodingImpl> {
  create(encoding: Partial<SizeEncodingImpl> | undefined, layer: LayerImpl, setDefault = true): SizeEncodingImpl | undefined {
    if (encoding) {
      return new SizeEncodingImpl(encoding)
    }
    if (setDefault) {
      return new SizeEncodingImpl({value: layer.getDefaultSize()})
    }
  }
}

class ColorEncodingFactory implements EncodingFactory<ColorEncodingImpl> {
  create(encoding: Partial<ColorEncodingImpl> | undefined, layer: LayerImpl, setDefault = true): ColorEncodingImpl | undefined {
    if (encoding) {
      return new ColorEncodingImpl(encoding)
    }

    if (setDefault) {
      return new ColorEncodingImpl({value: layer.getDefaultColor()})
    }
  }
}

class PolygonEncodingFactory implements EncodingFactory<PolygonEncodingImpl> {
  create(encoding: Partial<PolygonEncodingImpl> | undefined): PolygonEncodingImpl {
    return new PolygonEncodingImpl(encoding || {})
  }
}

class OffsetEncodingFactory implements EncodingFactory<OffsetEncodingImpl> {
  create(encoding: Partial<OffsetEncodingImpl> | undefined): OffsetEncodingImpl {
    return new OffsetEncodingImpl(encoding || {})
  }
}

export const sizeEncodingFactory = new SizeEncodingFactory()
export const colorEncodingFactory = new ColorEncodingFactory()
export const polygonEncodingFactory = new PolygonEncodingFactory()
export const offsetEncodingFactory = new OffsetEncodingFactory()

const ajv = new Ajv.Ajv({useDefaults: true})

const encodingMetadata = [
  {
    key: 'image',
    name: 'ImageEncoding',
  },
  {
    key: 'x',
    name: 'PositionEncoding',
  },
  {
    key: 'y',
    name: 'PositionEncoding',
  },
  {
    key: 'z',
    name: 'PositionEncoding',
  },
  {
    key: 'size',
    name: 'SizeEncoding',
    factory: sizeEncodingFactory,
  },
  {
    key: 'color',
    name: 'ImageColorEncoding',
  },
  {
    key: 'color',
    name: 'ModelColorEncoding',
  },
  {
    key: 'color',
    name: 'LineColorEncoding',
    factory: colorEncodingFactory,
  },
  {
    key: 'color',
    name: 'SchemeColorEncoding',
  },
  {
    key: 'color',
    name: 'ColorEncoding',
    factory: colorEncodingFactory,
  },
  {
    key: 'rotation',
    name: 'RotationEncoding',
  },
  {
    key: 'strokeColor',
    name: 'StrokeColorEncoding',
  },
  {
    key: 'strokeSize',
    name: 'StrokeSizeEncoding',
  },
  {
    key: 'borderRadius',
    name: 'BorderRadiusEncoding',
  },
  {
    key: 'icon',
    name: 'IconEncoding',
  },
  {
    key: 'text',
    name: 'TextEncoding',
  },
  {
    key: 'polygon',
    name: 'PolygonEncoding',
    factory: polygonEncodingFactory,
  },
  {
    key: 'offset',
    name: 'OffsetEncoding',
    factory: offsetEncodingFactory,
  },
  {
    key: 'line',
    name: 'LineEncoding',
  },
  {
    key: 'animation',
    name: 'AnimationEncoding',
  },
  {
    key: 'map',
    name: 'MapEncoding',
  },
  {
    key: 'model',
    name: 'ModelEncoding',
  },
  {
    key: 'rotation',
    name: 'RotationEncoding',
  },
  {
    key: 'fields',
  },
] as {
  key: string,
  name?: string,
  factory?: EncodingFactory<any>
}[]

// fixme: Marreta para aprender sobre o comportamento de encodings que podem ser desligados
const ignoreSymbols = (type: [string, unknown]) => !['position'].includes(type[0])


export function fillDefaults(layer: LayerImpl, sourceEncoding: any, defaultEncodings: EncodingName[]): any {
  const encoding = sourceEncoding ? clone(sourceEncoding) : {}
  const schema = getSchema(`${Case.pascal(layer.type)}LayerEncoding`)

  Object.entries(schema.properties as Record<string, any>)
    .filter(ignoreSymbols)
    .filter(([encodingKey]) => defaultEncodings.includes(encodingKey as EncodingName))
    .filter(([encodingKey]) => !encoding[encodingKey])
    .forEach(([encodingKey, encodingObject]) => {
      const symbol = sanitizeSymbol(encodingObject.$ref)
      let encodingSymbol = encodingMetadata.find(
        (e) => (symbol && e.name === symbol) && e.key === encodingKey
      )
      if (!encodingSymbol) {
        encodingSymbol = encodingMetadata.find(
          (e) => (symbol && e.name === symbol) || e.key === encodingKey
        )
      }
      if (!encodingSymbol) {
        throw new Error(`Unknown encoding symbol: ${encodingKey}:${symbol}`)
      }
      const clonedEncoding = encodingSymbol.factory?.create(encoding[encodingKey], layer) ?? {}
      if (encodingSymbol.name) {
        const schema = getSchema(encodingSymbol.name)
        ajv.validate(schema, clonedEncoding)
      }
      encoding[encodingKey] = clonedEncoding
    })

  return encoding
}


