import actions, {ActionTypes} from '../state/Actions'
import {getType} from 'typesafe-actions'
import { Reducer } from '@hopara/state'

export const schemaReducer: Reducer<{[key: string]: any}, ActionTypes> = (schema = {}, action) => {
  switch (action.type) {
    case getType(actions.schema.fetch.success):
      return action.payload
    default:
      return schema
  }
}
