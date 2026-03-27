import { IconCondition } from './Condition.js'

export interface IconEncoding {
  value?: string
  field?: string
  map?: any
  smartSearch?: boolean

  conditions?: IconCondition[]
}
