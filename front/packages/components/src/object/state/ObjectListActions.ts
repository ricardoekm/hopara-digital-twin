import {createAction, createAsyncAction} from 'typesafe-actions'
import { DatasetFilter, Rows } from '@hopara/dataset'
import { PaginatedRowset } from '../../paginated-rowset/PaginatedRowset'

export interface ObjectPayload {
  rowsetId: string
}

export interface ObjectFetchRequestPayload extends ObjectPayload {
  paginatedRowset: PaginatedRowset
  searchTerm?: string
  filterSet: {filters: any, offset: number, limit: number}
  append: boolean
  target: ObjectFetchTarget
}

export interface ObjectsPayload {
  rowsetId: string
  rows: Rows
  lastPage: boolean
  offset: number
  limit: number
  append: boolean
  target: ObjectFetchTarget
}

export interface ObjectSearchPayload {
  rowsetId: string
  searchTerm?: string
}

export interface ObjectPaginationPayload {
  rowsetId: string
  offset: number
}

export enum ObjectFetchTarget {
  ENTITY = 'ENTITY',
  SEARCH = 'SEARCH',
}

export interface QueryDiscoverRequest {
  searchTerm?: string;
  filterSet: { filters: any; offset: number; limit: number };
}

export interface QueryDiscoverResponse {
  filter: DatasetFilter,
  view: string
  dataSource: string
}

export const objectListActions = {
  fetch: createAsyncAction(
    'OBJECT_LIST_FETCH_REQUEST',
    'OBJECT_LIST_FETCH_SUCCESS',
    'OBJECT_LIST_FETCH_FAILURE',
  )<ObjectFetchRequestPayload, ObjectsPayload, { exception: Error }>(),
  search: createAction('OBJECT_LIST_TYPE_SEARCH')<ObjectSearchPayload>(),
  paginate: createAction('OBJECT_LIST_PAGINATE')<ObjectPaginationPayload>()
}

