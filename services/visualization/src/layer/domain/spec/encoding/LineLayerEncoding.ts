import { AnimationEncoding } from '../../../../encoding/domain/spec/Animation.js'
import {LineColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'
import {LineEncoding} from '../../../../encoding/domain/spec/LineEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {SizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'

export interface GroupEncoding {
  field?: string
}

export interface LineLayerEncoding {
  line?: LineEncoding
  color?: LineColorEncoding
  size?: SizeEncoding
  position?: PositionEncoding
  group?: GroupEncoding
  config?: ConfigEncoding
  animation?: AnimationEncoding
}

