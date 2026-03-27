import { DatasetFilter } from '../filter/DatasetFilter'
import { DatasetFilters } from '../filter/DatasetFilters'

export const SCOPE_COLUMN_NAME = 'hopara_scope'

export function createScopeFilter(scope:string) : DatasetFilter {
  return {column: SCOPE_COLUMN_NAME, values: [scope]}
}

export function createScopeFilters(scope?:string) : DatasetFilters {
  const filters = new DatasetFilters()
  if (scope) {
    filters.push(createScopeFilter(scope))
  }

  return filters
}
