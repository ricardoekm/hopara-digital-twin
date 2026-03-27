import { Data } from '../../../data/domain/spec/Data.js'

export enum AutoFillMode {
  ALWAYS = 'ALWAYS',
  IF_NO_OTHER_FILTER_FILLED = 'IF_NO_OTHER_FILTER_FILLED'
}

export enum ComparisonType {
  GREATER_EQUALS_THAN = 'GREATER_EQUALS_THAN',
  LESS_EQUALS_THAN = 'LESS_EQUALS_THAN',
  BETWEEN = 'BETWEEN',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
}

export type AutoFill = {
  mode: AutoFillMode
  values?: string[]
}

export interface FilterSpec {
  id?: string
  data: Data
  field: string
  required?: boolean
  singleChoice?: boolean
  autoFill?: AutoFill
  /**
   * @default EQUALS
  */
  comparisonType?: ComparisonType
}

export type Filters = FilterSpec[]
