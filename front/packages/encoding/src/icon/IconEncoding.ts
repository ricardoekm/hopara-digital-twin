import { isEmpty } from 'lodash'
import { BaseEncoding } from '../BaseEncoding'
import { Condition } from '../condition/Condition'

export type IconCondition = Condition & Partial<IconEncoding>

export class IconEncoding extends BaseEncoding<IconEncoding> {
  value?: string
  field?: string
  map: Record<string, string>
  smartSearch?: boolean
  conditions?: IconCondition[]

  constructor(props?: Partial<IconEncoding>) {
    super()
    Object.assign(this, props)
  }

  hasCondition(): boolean {
    return !isEmpty(this.conditions)
  }

  clone() {
    return new IconEncoding(this)
  }

  isRenderable(): boolean {
      return !!this.value || !!this.field
  }
}
