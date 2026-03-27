import { BaseEncoding } from '../BaseEncoding'
import { SizeUnits } from '../size/SizeEncoding'

export class EncodingConfig extends BaseEncoding<EncodingConfig> {
  units?: SizeUnits
  maxResizeZoom?: number

  constructor(props?: Partial<EncodingConfig> | any) {
    super()
    Object.assign(this, props)
  }

  isRenderable(): boolean {
    return true
  }
}
