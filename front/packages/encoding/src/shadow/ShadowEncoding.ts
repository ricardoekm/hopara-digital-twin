import {BaseEncoding} from '../BaseEncoding'

export class ShadowEncoding extends BaseEncoding<ShadowEncoding> {
  inner?: boolean
  outer?: boolean

  constructor(props?: Partial<ShadowEncoding> | any) {
    super()
    Object.assign(this, props)
  }

  isRenderable(): boolean {
    return true
  }
}
