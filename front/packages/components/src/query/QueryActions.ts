import { Queries, Query } from '@hopara/dataset'
import { Data } from '@hopara/encoding'
import {createAction, createAsyncAction} from 'typesafe-actions'

export interface DataListUpdatedPayload {
  dataList: Data[]
}

export interface FetchQueriesSuccess {
  queries: Queries
}

const actions = {
  changed: createAction('QUERY_CHANGED')<void>(),
  fetch: createAsyncAction(
    'FETCH_QUERIES_REQUEST',
    'FETCH_QUERIES_SUCCESS',
    'FETCH_QUERIES_FAILURE',
  )<void, FetchQueriesSuccess, {exception: Error}>(),
  mergedWithRowset: createAction('QUERY_MERGED_WITH_ROWSET')<{query: Query}>(),
}

export default actions
