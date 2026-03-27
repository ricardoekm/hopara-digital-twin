import LayerImpl from './LayerImpl.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'

export class AreaLayerImpl extends LayerImpl {
  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.COLOR, EncodingName.POSITION]
  }
}
