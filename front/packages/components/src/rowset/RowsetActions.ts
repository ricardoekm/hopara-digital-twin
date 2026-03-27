import {createAction, createAsyncAction} from 'typesafe-actions'
import {Rowset} from './Rowset'
import Visualization from '../visualization/Visualization'
import ViewState from '../view-state/ViewState'
import {Query, Row} from '@hopara/dataset'
import {Data, PositionEncoding} from '@hopara/encoding'
import {SelectedFilters} from '../filter/domain/SelectedFilters'
import {FetchProgressPayload} from '@hopara/resource'
import { Floor } from '../floor/Floor'

interface FetchDataPayload {
  rowset: Rowset
}

export interface FetchDataRequestPayload {
  visualization: Visualization
  rowset: Rowset
  viewState: ViewState
  selectedFilters: SelectedFilters
  floor: Floor | undefined
  prefetch: boolean
}

export interface FetchDataFailurePayload {
  reason: string
  exception: Error
  rowset: Rowset
}

export interface RowFieldsSaveRequestPayload {
  row: Row
  query: Query
  rowsetId: string
  layerId?: string
  updateRowData: any
  positionEncoding?: PositionEncoding
  isUndo?: boolean
}

export interface RowPositionSaveRequestPayload extends RowFieldsSaveRequestPayload {
  positionEncoding: PositionEncoding
  layerId: string
}

export interface RowSaveSuccess {
  row: Row
  rowsetId: string
  layerId?: string
  isUndo?: boolean
}

export interface RowSaveError {
  reason: string
  exception: Error
}

export type RowPositionUpdatedPayload = {
  data: Data
  row: any
  rowId: any
}

export type RowUpdatedPayload = {
  data: Data
  rowId: any
  row: any
}

export interface FieldsUpdatedPayload {
  layerId: string
  rowsetId: string
  data: Data
  row: Row
  updatedFields: Record<string, any>
}

const actions = {
  rowSave: createAsyncAction(
    'ROWSET_ROW_SAVE_REQUEST',
    'ROWSET_ROW_SAVE_SUCCESS',
    'ROWSET_ROW_SAVE_FAILURE',
  )<void, RowSaveSuccess, RowSaveError>(),

  rowFieldsSaveRequested: createAction('ROW_FIELDS_SAVE_REQUESTED')<RowFieldsSaveRequestPayload>(),
  rowPositionSaveRequested: createAction('ROW_POSITION_SAVE_REQUESTED')<RowPositionSaveRequestPayload>(),
  fetchDataRequested: createAction('ROWSET_FETCH_DATA_REQUESTED')<FetchDataRequestPayload>(),
  fetch: createAsyncAction(
    'ROWSET_FETCH_DATA_REQUEST',
    'ROWSET_FETCH_DATA_SUCCESS',
    'ROWSET_FETCH_DATA_FAILURE',
  )<FetchDataPayload, FetchDataPayload, FetchDataFailurePayload>(),
  fetchDataProgress: createAction('ROWSET_FETCH_DATA_PROGRESS')<FetchProgressPayload>(),
  rowUpdated: createAction('ROW_UPDATED')<RowUpdatedPayload>(),
  rowPositionUpdated: createAction('ROW_POSITION_UPDATED')<RowPositionUpdatedPayload>(),
  refresh: createAction('ROWSET_REFRESH')<void>(),
  loadComplete: createAction('ROWSET_LOAD_COMPLETE')<void>(),
}

export default actions
