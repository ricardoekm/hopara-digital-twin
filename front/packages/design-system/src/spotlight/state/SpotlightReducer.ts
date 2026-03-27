import {getType} from 'typesafe-actions'
import {Reducer} from '@hopara/state'
import {SpotlightStore} from './SpotlightStore'
import {spotlightActions, SpotlightActions} from './SpotlightActions'

export const spotlightReducer: Reducer<SpotlightStore, any> = (state = new SpotlightStore(), action: SpotlightActions): SpotlightStore => {
  switch (action.type) {
    case getType(spotlightActions.open):
      return state.setElementId(action.payload.elementId)
    case getType(spotlightActions.close):
      return state.clear()
    default:
      return state
  }
}

