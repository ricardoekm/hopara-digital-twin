import LayerImpl from './LayerImpl.js'
import {OffsetEncodingImpl} from '../../encoding/domain/impl/OffsetEncodingImpl.js'
import {TextLayerEncoding} from './spec/encoding/TextLayerEncoding.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'
import {TextLayer} from './spec/Layer.js'

export class TextLayerImpl extends LayerImpl {
  constructor(props: TextLayer) {
    super(props)
    const encoding = props.encoding as TextLayerEncoding
    this.encoding.offset = new OffsetEncodingImpl(encoding.offset)
  }

  getDefaultEncodings(): EncodingName[] {
    return [EncodingName.COLOR, EncodingName.SIZE, EncodingName.OFFSET]
  }

  getDefaultSize(): any {
    return 12
  }
}

