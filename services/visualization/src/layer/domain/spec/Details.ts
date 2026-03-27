import { ColorEncoding } from '../../../encoding/domain/spec/ColorEncoding.js'
import { ImageEncoding } from '../../../encoding/domain/spec/ImageEncoding.js'
import {TextEncoding} from '../../../encoding/domain/spec/TextEncoding.js'

export type DetailsField = {
  title?: string
  visible?: boolean
  value: {
    encoding: {
      text?: TextEncoding
      image?: ImageEncoding
      color?: ColorEncoding
    }
  }
}

export interface Details {
  fields?: DetailsField[]
  tooltip?: boolean
  enabled?: boolean
}
