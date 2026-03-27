import {EncodingName} from '../../encoding/domain/Encoding.js'
import LayerImpl from './LayerImpl.js'
import {IconLayer} from './spec/Layer.js'

export class IconLayerImpl extends LayerImpl {
  constructor(props: IconLayer) {
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
    return 20
  }
}
