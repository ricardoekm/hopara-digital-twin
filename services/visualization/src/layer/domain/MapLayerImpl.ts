import { EncodingName } from '../../encoding/domain/Encoding.js'
import LayerImpl from './LayerImpl.js'

export class MapLayerImpl extends LayerImpl {
  getDefaultEncodings(): any {
    return [EncodingName.MAP]
  }
}
