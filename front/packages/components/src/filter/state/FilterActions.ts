import {createAction, createAsyncAction} from 'typesafe-actions'
import { ComparisonType, Filter} from '../domain/Filter'
import {AutoFillMode} from '../domain/AutoFill'
import {Query} from '@hopara/dataset'
import { Data } from '@hopara/encoding'
import { DateRangeValue } from '../DateRangeFilter'

interface ValueChangedPayload {
  field: string
  value: string | undefined
}

interface SearchRequestPayload {
  data: Data
  field: string
  term: string | undefined
}

interface SearchRequestSuccess {
  data: Data
  field: string
  values: any[]
}

interface LoadFilterSuccess {
  id: string
  values: any[]
}

const actions = {
  valueChanged: createAction('FILTER_VALUE_CHANGED')<ValueChangedPayload>(),
  dateChanged: createAction('FILTER_DATE_CHANGED')<{ field: string, values?: DateRangeValue}>(),

  searchChanged: createAction('FILTER_SEARCH_CHANGED')<SearchRequestPayload>(),
  search: createAsyncAction(
    'FILTER_SEARCH_REQUEST',
    'FILTER_SEARCH_SUCCESS',
    'FILTER_SEARCH_FAILURE',
  )<void, SearchRequestSuccess, { exception: Error }>(),

  loadValues: createAsyncAction(
    'FILTER_LOAD_VALUES_REQUEST',
    'FILTER_LOAD_VALUES_SUCCESS',
    'FILTER_LOAD_VALUES_FAILURE',
  )<void, LoadFilterSuccess, { exception: Error }>(),

  changed: createAction('FILTER_CHANGED')<{ id: string, filter: Filter }>(),
  move: createAction('FILTER_MOVE')<{ id: string, steps: number }>(),
  delete: createAction('FILTER_DELETE')<{ id: string }>(),
  selected: createAction('FILTER_SELECT')<{ id?: string }>(),
  create: createAsyncAction(
    'FILTER_CREATE_REQUEST',
    'FILTER_CREATE_SUCCESS',
    'FILTER_CREATE_FAILURE',
  )<void, { filter: Filter }, { exception: Error }>(),
  singleChoiceChanged: createAction('FILTER_SINGLE_CHOICE_CHANGED')<{ id: string, singleChoice: boolean }>(),
  requiredChanged: createAction('FILTER_REQUIRED_CHANGED')<{ id: string, required: boolean }>(),
  fieldChanged: createAction('FILTER_FIELD_CHANGED')<{ id: string, field: string }>(),
  queryChanged: createAction('FILTER_QUERY_CHANGED')<{ id: string, query: Query }>(),
  dataSourceChanged: createAction('FILTER_DATA_SOURCE_CHANGED')<{ id: string, dataSource: string }>(),
  autoFillModeChanged: createAction('FILTER_AUTOFILL_MODE_CHANGED')<{ id: string, mode?: AutoFillMode }>(),
  advancedModeClick: createAction('FILTER_ADVANCED_MODE_CLICK')<{ enabled: boolean }>(),
  comparisonTypeChanged: createAction('FILTER_COMPARISON_TYPE_CHANGED')<{ id: string, comparisonType: ComparisonType }>(),
}

export default actions
