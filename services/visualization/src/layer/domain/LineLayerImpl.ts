import LayerImpl from './LayerImpl.js'
import { LineCap } from '../../encoding/domain/spec/LineEncoding.js'
import { LineEncoding} from '../../encoding/domain/spec/LineEncoding.js'
import { LineLayerEncoding } from './spec/encoding/LineLayerEncoding.js'
import { EncodingName } from '../../encoding/domain/Encoding.js'
import { LineLayer} from './spec/Layer.js'
import isNil from 'lodash/fp/isNil.js'

export class LineLayerImpl extends LayerImpl {
  constructor(props:LineLayer) {
    super(props)
    const encoding = props.encoding as LineLayerEncoding
    const lineEncoding = encoding.line ?? {} as LineEncoding

    if ( !lineEncoding.cap ) {
      lineEncoding.cap = LineCap.BUTT
    }

    if ( isNil(lineEncoding.segmentLength) ) {
      lineEncoding.segmentLength = 500
    }

    this.encoding.line = lineEncoding
  }

  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.COLOR, EncodingName.SIZE]
  }

  getDefaultSize(): any {
    return 20
  }

  getDefaultColor() {
    return '#808080'
  }
}
