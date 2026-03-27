import {PolygonEncodingImpl} from '../../encoding/domain/impl/PolygonEncodingImpl.js'
import LayerImpl from './LayerImpl.js'
import {PolygonLayerEncoding} from './spec/encoding/PolygonLayerEncoding.js'
import {EncodingName} from '../../encoding/domain/Encoding.js'
import {PolygonLayer} from './spec/Layer.js'

export class PolygonLayerImpl extends LayerImpl {
  constructor(props: PolygonLayer) {
    super(props)

    const encoding = props.encoding as PolygonLayerEncoding
    this.encoding.polygon = new PolygonEncodingImpl(encoding.polygon!)
  }

  getDefaultEncodings(): EncodingName[] {
    return [
      EncodingName.POLYGON,
      EncodingName.COLOR,
      EncodingName.STROKE_COLOR,
      EncodingName.STROKE_SIZE
    ]
  }
}
