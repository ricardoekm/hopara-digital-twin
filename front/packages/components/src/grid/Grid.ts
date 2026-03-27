import { Encodings } from '@hopara/encoding'
import { Type } from 'class-transformer'

export class Grid {
  layerId: string
  alwaysVisible?: boolean
  
  @Type(() => Encodings)
  encoding: Encodings
}
