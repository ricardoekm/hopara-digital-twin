import isNil from 'lodash/fp/isNil.js'
import {Condition} from '../../encoding/domain/spec/Condition.js'
import { ZoomRange } from './spec/ZoomRange.js'

export class VisibleImpl {
  value?: boolean
  zoomRange?: ZoomRange
  condition?: Condition

  constructor(props?: Partial<VisibleImpl>) {
    if (isNil(props?.value)) {
      this.value = true
    }
    Object.assign(this, props)
  }
}
