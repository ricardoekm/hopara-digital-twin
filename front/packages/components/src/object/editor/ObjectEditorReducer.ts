import { getType } from 'typesafe-actions'
import actions, {ActionTypes} from '../../state/Actions'
import { MapStyle } from '@hopara/encoding'
import { Reducer } from '@hopara/state'

interface ObjectEditorStore{
  mapStyle?: MapStyle
  itemTabIndex?: number
}

export const objectEditorReducer: Reducer<ObjectEditorStore, ActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case getType(actions.objectEditor.pageLoaded):
      return {
        ...state,
        itemTabIndex: 0,
      }
    case getType(actions.objectEditor.mapStyleChanged):
      return {
        ...state,
        mapStyle: action.payload.mapStyle,
      }
    case getType(actions.objectEditor.itemTabChanged):
      return {
        ...state,
        itemTabIndex: action.payload.tabIndex,
      }
    default:
      return state
  }
}
