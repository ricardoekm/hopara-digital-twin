import {ColorEncoding, StrokeColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import {SizeEncoding, StrokeSizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import { OffsetEncoding } from '../../../../encoding/domain/spec/OffsetEncoding.js'
import {ShadowEncoding} from '../../../../encoding/domain/spec/ShadowEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'
import { AnimationEncoding } from '../../../../encoding/domain/spec/Animation.js'

export interface CircleLayerEncoding {
  position?: PositionEncoding
  color?: ColorEncoding
  size?: SizeEncoding
  offset?: OffsetEncoding
  strokeSize?: StrokeSizeEncoding
  strokeColor?: StrokeColorEncoding
  shadow?: ShadowEncoding
  config?: ConfigEncoding
  animation?: AnimationEncoding
}
