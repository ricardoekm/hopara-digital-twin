import { IconEncoding as IconEncodingSpec } from '../spec/IconEncoding.js'

export class IconEncodingImpl implements IconEncodingSpec {
  value?: string
  field?: string
  map?: any
  smartSearch?: boolean

  constructor(props: Partial<IconEncodingSpec>) {
    Object.assign(this, props)
    if (this.field && this.smartSearch === undefined) this.smartSearch = true
    if (!this.field && this.smartSearch !== undefined) delete this.smartSearch
  }
}
