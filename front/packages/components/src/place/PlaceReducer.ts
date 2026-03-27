import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import {Reducer} from '@hopara/state'
import { PlaceStore, PlaceStoreStatus } from './PlaceStore'

export const placeReducer: Reducer<PlaceStore, ActionTypes> = (state = new PlaceStore(), action) => {
  switch (action.type) {
    case getType(actions.place.search.success): {
      return state.setPlaces(action.payload.places).setStatus(PlaceStoreStatus.NONE)
    }
    default:
      return state
  }
}
