import { ResourceEncoding } from '../ResourceEncoding'

export class ModelEncoding extends ResourceEncoding<ModelEncoding> {
  overlap?: boolean
  scope?: string

  constructor(props?: Partial<ModelEncoding>) {
    super()
    Object.assign(this, props)
  }
}
