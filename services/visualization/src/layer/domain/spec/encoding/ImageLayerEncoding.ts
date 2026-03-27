import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'
import {ImageEncoding} from '../../../../encoding/domain/spec/ImageEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {ImageColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'

export interface ImageLayerEncoding {
  image?: ImageEncoding
  position?: PositionEncoding
  config?: ConfigEncoding
  color?: ImageColorEncoding
}
