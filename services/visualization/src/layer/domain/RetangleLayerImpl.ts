import { EncodingName } from '../../encoding/domain/Encoding.js'
import LayerImpl from './LayerImpl.js'

export class RectangleLayerImpl extends LayerImpl {
  getDefaultEncodings(): any {
    return [EncodingName.COLOR]
  }
}
