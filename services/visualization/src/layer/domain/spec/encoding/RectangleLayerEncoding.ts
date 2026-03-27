import { ColorEncoding } from '../../../../encoding/domain/spec/ColorEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'

export interface RectangleLayerEncoding {
  position?: PositionEncoding
  color?: ColorEncoding
  config?: ConfigEncoding
}

