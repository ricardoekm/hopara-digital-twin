import LayerImpl from './LayerImpl.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'

export class BarLayerImpl extends LayerImpl {
  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.COLOR]
  }
}
