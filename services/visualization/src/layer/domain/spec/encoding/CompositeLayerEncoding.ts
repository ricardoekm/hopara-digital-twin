import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {SizeMultiplierEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'
import {ConfigEncoding} from '../../../../encoding/domain/spec/ConfigEncoding.js'

export interface CompositeLayerEncoding {
  position?: PositionEncoding
  size?: SizeMultiplierEncoding
  config?: ConfigEncoding
}


