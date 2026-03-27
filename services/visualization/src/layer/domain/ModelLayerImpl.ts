import {EncodingName} from '../../encoding/domain/Encoding.js'
import LayerImpl from './LayerImpl.js'
import {ModelLayer} from './spec/Layer.js'

export class ModelLayerImpl extends LayerImpl {
  constructor(props:ModelLayer) {
    super(props)
  }

  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.SIZE, EncodingName.COLOR]
  }

  getDefaultSize(): any {
    return 25
  }
}
