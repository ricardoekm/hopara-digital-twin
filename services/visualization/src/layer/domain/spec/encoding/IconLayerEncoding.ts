import {ColorEncoding, StrokeColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import {IconEncoding} from '../../../../encoding/domain/spec/IconEncoding.js'
import {SizeEncoding, StrokeSizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {OffsetEncoding} from '../../../../encoding/domain/spec/OffsetEncoding.js'
import {ConfigEncoding} from '../../../../encoding/domain/spec/ConfigEncoding.js'
import {AnimationEncoding} from '../../../../encoding/domain/spec/Animation.js'

export interface IconLayerEncoding {
  icon?: IconEncoding
  size?: SizeEncoding
  color?: ColorEncoding
  position?: PositionEncoding
  offset?: OffsetEncoding
  config?: ConfigEncoding
  animation?: AnimationEncoding
  strokeSize?: StrokeSizeEncoding
  strokeColor?: StrokeColorEncoding
}

