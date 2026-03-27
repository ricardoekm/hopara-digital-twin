import {DatasetFilters} from './DatasetFilters'

export type FilterSet = {
  filters: DatasetFilters
  limit?: number
  offset?: number
}

export enum ComparisonType {
  GREATER_EQUALS_THAN = 'GREATER_EQUALS_THAN',
  LESS_EQUALS_THAN = 'LESS_EQUALS_THAN',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  INTERSECTS = 'INTERSECTS',
}

export type DatasetFilter = {
  column: string,
  values: any[],
  partialMatch?: boolean,
  comparisonType?: ComparisonType
}
