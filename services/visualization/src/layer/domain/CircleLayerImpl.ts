import {EncodingName} from '../../encoding/domain/Encoding.js'
import LayerImpl from './LayerImpl.js'
import {CircleLayer} from './spec/Layer.js'

export class CircleLayerImpl extends LayerImpl {
  constructor(props?: CircleLayer) {
    super(props)
  }

  getDefaultEncodings(): EncodingName[] {
    return [
      EncodingName.COLOR,
      EncodingName.SIZE,
      EncodingName.STROKE_COLOR,
      EncodingName.STROKE_SIZE
    ]
  }

  getDefaultSize(): any {
    return 32
  }
}
