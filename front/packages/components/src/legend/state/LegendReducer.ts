import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../../state/Actions'
import { Legends } from '../Legends'
import { Reducer } from '@hopara/state'

export const legendReducer: Reducer<Legends, ActionTypes> = (legendState = new Legends(), action): Legends => {
  switch (action.type) {
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
      return action.payload.legends
    case getType(actions.legend.changed):
      return new Legends(...action.payload.legends)
    case getType(actions.layer.deleted):
      return legendState.removeFromLayerId(action.payload.id)
    default:
      return legendState
  }
}


