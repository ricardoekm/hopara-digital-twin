import { ZoomRange } from './ZoomRange.js'
import {Condition} from '../../../encoding/domain/spec/Condition.js'

export interface Visible {
  /**
  * @description Toogle visibility.
  * @default true
  */
  value?: boolean,
  zoomRange?: ZoomRange
  condition?: Condition
}
