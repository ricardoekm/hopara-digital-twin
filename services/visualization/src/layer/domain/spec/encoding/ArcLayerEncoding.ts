import {ColorEncoding} from '../../../../encoding/domain/spec/ColorEncoding.js'
import {ArcEncoding} from '../../../../encoding/domain/spec/ArcEncoding.js'
import {SizeEncoding} from '../../../../encoding/domain/spec/SizeEncoding.js'
import { ConfigEncoding } from '../../../../encoding/domain/spec/ConfigEncoding.js'

export interface ArcLayerEncoding {
  color?: ColorEncoding
  size?: SizeEncoding
  arc?: ArcEncoding
  config?: ConfigEncoding
}

