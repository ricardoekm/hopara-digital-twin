import { AnimationEncoding } from '../../../../encoding/domain/spec/Animation.js'
import {ColorEncoding, StrokeColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'
import {PolygonEncoding} from '../../../../encoding/domain/spec/PolygonEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {BorderRadiusEncoding, StrokeSizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'

export interface PolygonLayerEncoding {
  polygon?: PolygonEncoding
  color?: ColorEncoding
  strokeSize?: StrokeSizeEncoding
  borderRadius?: BorderRadiusEncoding
  strokeColor?: StrokeColorEncoding
  position?: PositionEncoding
  config?: ConfigEncoding
  animation?: AnimationEncoding
}

