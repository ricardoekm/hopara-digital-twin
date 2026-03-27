import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../../state/Actions'
import { ChartStore } from './ChartStore'
import { Reducer } from '@hopara/state'

export const chartReducer: Reducer<ChartStore, ActionTypes> = (state = new ChartStore(), action): ChartStore => {
  switch (action.type) {
    case getType(actions.view.chartCreated):
    case getType(actions.view.chartUpdated):
      return state.setDimensions(action.payload.dimensions)
                  .setProjector(action.payload.projector)
    default:
      return state
  }
}
