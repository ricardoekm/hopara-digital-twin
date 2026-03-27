import {ColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import {PositionEncoding} from '../../../../encoding/domain/spec/PositionEncoding.js'
import {SizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'
import {TextEncoding} from '../../../../encoding/domain/spec/TextEncoding.js'
import {OffsetEncoding} from '../../../../encoding/domain/spec/OffsetEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'

export interface TextLayerEncoding {
  text?: TextEncoding
  color?: ColorEncoding
  size?: SizeEncoding
  offset?: OffsetEncoding
  position?: PositionEncoding
  config?: ConfigEncoding
}

