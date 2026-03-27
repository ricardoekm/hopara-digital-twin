import { ColorEncoding } from '../encoding/domain/spec/ColorEncoding.js'
import { ConfigEncoding } from '../encoding/domain/spec/ConfigEncoding.js'
import { SizeEncoding } from '../encoding/domain/spec/SizeEncoding.js'

export interface Grid {
  layerId: string
  alwaysVisible?: boolean
  encoding: {
    angle: SizeEncoding
    size: SizeEncoding
    strokeSize: SizeEncoding
    strokeColor: ColorEncoding
    config: ConfigEncoding
  }
}

export type Grids = Grid[]
