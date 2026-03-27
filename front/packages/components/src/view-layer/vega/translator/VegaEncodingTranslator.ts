import {Encodings, PositionScales} from '@hopara/encoding'
import {VegaSizeTranslator} from './VegaSizeTranslator'
import {VegaColorTranslator} from './VegaColorTranslator'
import {VegaPositionTranslator} from './VegaPositionTranslator'
import {VegaRadiusTranslator} from './VegaRadiusTranslator'
import {LayerType} from '../../../layer/LayerType'
import { VegaLineTranslator } from './VegaLineTranslator'

const vegaSizeTranslator = new VegaSizeTranslator()
const vegaColorTranslator = new VegaColorTranslator()
const vegaPositionTranslator = new VegaPositionTranslator()
const vegaRadiusTranslator = new VegaRadiusTranslator()
const vegaLineTranslator = new VegaLineTranslator()

export class VegaEncodingTranslator {
  translate(layerType: LayerType, encoding: Encodings, positionScales?: PositionScales) {
    if (layerType === LayerType.arc) {
      return {
        ...vegaColorTranslator.translate(encoding.color),
        ...vegaRadiusTranslator.translate(encoding.size),
        theta: encoding.arc?.field ? {'field': encoding.arc?.field, 'type': 'quantitative'} : undefined,
      }
    } else if (layerType === LayerType.line) {
      return {
        ...vegaLineTranslator.translate(encoding.line),
        ...vegaPositionTranslator.translate(encoding.position, positionScales),
        ...vegaColorTranslator.translate(encoding.color),
        ...vegaSizeTranslator.translate(layerType, encoding.size),
      }
    }

    return {
      ...vegaPositionTranslator.translate(encoding.position, positionScales),
      ...vegaColorTranslator.translate(encoding.color),
      ...vegaSizeTranslator.translate(layerType, encoding.size),
    }
  }
}
