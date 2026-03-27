import { select } from '@redux-saga/core/effects'
import { Filters } from '../filter/domain/Filters'
import { Store } from '../state/Store'
import { SelectedFilters } from '../filter/domain/SelectedFilters'
import { getAutoFillValues } from '../filter/domain/AutoFill'
import { SelectedFilter } from '../filter/domain/SelectedFilter'
import { QueryHolder } from '../layer/QueryHolder'
import QueryStore from '../query/QueryStore'
import { Columns } from '@hopara/dataset'
import { getFilters } from '../filter/DatasetFiltersFactory'
import { FloorStore } from '../floor/FloorStore'
import { Box } from '@hopara/spatial'

export function* getAutoFilledFilters() {
  const filters: Filters = yield select((store: Store) => store.filterStore.filters)
  const selectedFilters: SelectedFilters = yield select((store: Store) => store.filterStore.selectedFilters)
  const payloadFilters = selectedFilters.clone()

  filters.forEach((filter) => {
    const selectedFilter = selectedFilters.getByField(filter.field)
    const values = selectedFilter?.values.length ? selectedFilter?.values : getAutoFillValues(filter, selectedFilters)
    payloadFilters.push(new SelectedFilter({
      field: filter.field,
      values: values ?? [],
      comparisonType: filter.comparisonType,
    }))
  })
  return payloadFilters
}

export function* getAllColumns(queryHolder:QueryHolder) {
  const queryStore: QueryStore = yield select((store: Store) => store.queryStore)
  const query = queryStore.queries.findQuery(queryHolder.getQueryKey())
  if (!query) {
    return new Columns()
  }

  const positionQuery = queryStore.queries.findQuery(queryHolder.getPositionQueryKey())
  if (!positionQuery) {
    return new Columns()
  }

  if (!queryHolder.getPositionEncoding()) {
    return new Columns()
  }

  return new Columns(...queryStore.queries.getAllColumns(), ...positionQuery.columns, ...query.columns)
}

export enum FilterType { 
  SELECTED = 'SELECTED',
  FLOOR = 'FLOOR',
  BOX = 'BOX'
}

export function* getDatasetFilters(filterTypes: FilterType[], queryHolder:QueryHolder, fetchBox?:Box) {
  const floorStore:FloorStore = yield select((store: Store) => store.floorStore)  
  const floor = filterTypes.includes(FilterType.FLOOR) ? floorStore.getCurrent() : undefined
  const autoFilledFilters = filterTypes.includes(FilterType.SELECTED) ? yield getAutoFilledFilters() : []
  const fetchBoxFilter = filterTypes.includes(FilterType.BOX) ? fetchBox : undefined
  const allColumns = yield getAllColumns(queryHolder)
  return getFilters(autoFilledFilters, queryHolder.getPositionEncoding()!, allColumns, floor, fetchBoxFilter)
}
