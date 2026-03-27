import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import {FetchProgressStore} from './FetchStore'
import { Reducer } from '@hopara/state'

export const fetchReducer: Reducer<FetchProgressStore, ActionTypes> = (state = new FetchProgressStore(), action): FetchProgressStore => {
  switch (action.type) {
    case getType(actions.resource.downloadProgress):
    case getType(actions.rowset.fetchDataProgress):
      return state?.addProgress(action.payload)
    default:
      return state
  }
}
