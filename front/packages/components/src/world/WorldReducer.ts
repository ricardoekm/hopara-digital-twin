import actions, {ActionTypes} from '../state/Actions'
import {getType} from 'typesafe-actions'
import { World } from './World'
import { Reducer } from '@hopara/state'

export const worldReducer: Reducer<World | undefined, ActionTypes> = (state, action) => {
  switch (action.type) {
    case getType(actions.visualization.routeChanged):
      return
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.fetch.failure):
      return action.payload.world
    default:
      return state
  }
}
