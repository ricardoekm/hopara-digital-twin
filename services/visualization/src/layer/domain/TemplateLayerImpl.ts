import LayerImpl from './LayerImpl.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'
import {TemplateLayer} from './spec/Layer.js'

export class TemplateLayerImpl extends LayerImpl {
  constructor(props: TemplateLayer) {
    super(props)
  }

  getDefaultEncodings(): EncodingName[] {
    return []
  }
}


