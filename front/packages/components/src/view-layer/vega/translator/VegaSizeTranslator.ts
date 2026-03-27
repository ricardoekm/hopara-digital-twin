import { SizeEncoding } from '@hopara/encoding'
import { LayerType } from '../../../layer/LayerType'

export class VegaSizeTranslator {
  encodingIsValidForLayer(layerType: LayerType) {
    return layerType !== LayerType.rectangle
  }

  translate(layerType: LayerType, sizeEncoding?: SizeEncoding) {
    if (!sizeEncoding || !this.encodingIsValidForLayer(layerType)) {
      return {}
    }

    return {
      size: {
        field: sizeEncoding.field,
        value: sizeEncoding.getRenderValue(),
      },
    }
  }
}
