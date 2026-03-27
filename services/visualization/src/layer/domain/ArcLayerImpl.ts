import LayerImpl from './LayerImpl.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'
import {ArcLayer} from './spec/Layer.js'

export class ArcLayerImpl extends LayerImpl {
  constructor(props: ArcLayer) {
    super(props)
  }

  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.COLOR, EncodingName.SIZE]
  }

  getDefaultSize(): any {
    return 20
  }
}
