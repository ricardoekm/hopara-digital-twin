import { get } from 'lodash/fp'
import { VisualizationJump, VisualizationJumpFilter } from '../action/Action'
import { SelectedFilter } from '../filter/domain/SelectedFilter'
import {Row} from '@hopara/dataset'

const createFilter = (jumpFilter:VisualizationJumpFilter, value:any) => {
  return new SelectedFilter({
    field: jumpFilter.targetField || jumpFilter.field,
    values: [value],
  })
}

export const createJumpFilters = (action: VisualizationJump, row?: Row) => {
  const validFilters = action.filters?.filter((filter) => (filter.field && row && get(filter.field, row)) || filter.value) ?? []
  return validFilters.map((filter) => createFilter(filter, filter.value || (row && get(filter.field!, row))))
}
