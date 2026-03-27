import LayerImpl from './LayerImpl.js'
import {CompositeLayer} from './spec/Layer.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'

export class CompositeLayerImpl extends LayerImpl {
  constructor(props:CompositeLayer) {
    super(props)
    
    if ( !this.children ) {
      this.children = []
    }
  }

  getDefaultEncodings(): EncodingName[] {
    return []
  }
}
