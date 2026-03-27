import { ResourceEncoding } from '../ResourceEncoding'

export const VIEW_MANAGED_FIELD = 'hopara_view'
export const VIEW_DEFAULT_VALUE = '45'

export class ViewEncoding extends ResourceEncoding<ViewEncoding> {
    constructor(props?: Partial<ViewEncoding>) {
      super()
      Object.assign(this, props)
    }
}
