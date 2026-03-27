import {Query, Rows} from '@hopara/dataset'
import {Layer} from '../../../layer/Layer'
import {VegaMarkTranslator} from './VegaMarkTranslator'
import {VegaEncodingTranslator} from './VegaEncodingTranslator'
import {PositionScales} from '@hopara/encoding'
import {VegaLayer} from '../VegaLayer'

const markTranslator = new VegaMarkTranslator()
const encodingTranslator = new VegaEncodingTranslator()

export class VegaTranslator {
  translate(layer: Layer, rows: Rows, query?: Query, positionScales?: PositionScales): VegaLayer[] {
    return [{
      name: layer.getId(),
      data: {values: rows},
      mark: markTranslator.translate(layer.type, layer.encoding.position),
      encoding: encodingTranslator.translate(layer.type, layer.encoding, positionScales),
      query,
      _transform: layer.getTransform(),
      lastModified: layer.getLastModified(),
    }]
  }
}
