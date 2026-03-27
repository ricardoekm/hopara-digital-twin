import {createAsyncAction} from 'typesafe-actions'

export const schemaActions = {
  fetch: createAsyncAction(
    'FETCH_SCHEMA_REQUEST',
    'FETCH_SCHEMA_SUCCESS',
    'FETCH_SCHEMA_FAILURE',
  )<void, any, { exception: Error }>(),
}
