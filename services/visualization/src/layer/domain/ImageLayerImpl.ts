import LayerImpl from './LayerImpl.js'
import {ImageLayer} from './spec/Layer.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'

export class ImageLayerImpl extends LayerImpl {
  constructor(props: ImageLayer) {
    super(props)
    if (!props.details?.tooltip) {
      this.details!.tooltip = false
    }
  }

  getDefaultEncodings(): any {
    return [EncodingName.COLOR]
  }
}

