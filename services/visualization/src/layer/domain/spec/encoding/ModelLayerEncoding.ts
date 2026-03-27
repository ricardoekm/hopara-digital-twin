import {ModelEncoding as ModelEncoding} from '../../../../encoding/domain/spec/ModelEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import { SizeEncoding } from '../../../../encoding/domain/spec/SizeEncoding.js'
import { RotationEncoding } from '../../../../encoding/domain/spec/RotationEncoding.js'
import {ModelColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'

export interface ModelLayerEncoding {
  model?: ModelEncoding
  size?: SizeEncoding
  position?: PositionEncoding
  rotation?: RotationEncoding
  color?: ModelColorEncoding
  config?: ConfigEncoding
}

