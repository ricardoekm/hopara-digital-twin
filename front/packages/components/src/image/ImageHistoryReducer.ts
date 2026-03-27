import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import {ResourceHistory} from '@hopara/resource'
import {Reducer} from '@hopara/state'

export const imageHistoryReducer: Reducer<ResourceHistory, ActionTypes> = (state = new ResourceHistory(), action): ResourceHistory => {
  switch (action.type) {
    case getType(actions.details.open): {
      if (!state.layerId) return state

      return state
        .setLayerId()
        .setRowId()
    }
    case getType(actions.visualization.pageLoaded):
    case getType(actions.settings.pageLoaded):
    case getType(actions.layerEditor.pageLoaded):
    case getType(actions.objectEditor.pageLoaded):
    case getType(actions.details.backClicked):
    case getType(actions.details.closeClicked):
    case getType(actions.navigation.floorChangeRequested):
    case getType(actions.object.typeSelected):
      return state.clear()
    case getType(actions.image.restore.success):
    case getType(actions.image.undo.success):
      return state
        .setLoading(true)
        .setResourceId(action.payload.resourceId)
        .setLibrary(action.payload.library)
        .setCurrentVersion(action.payload.version)
        .setItems([])
    case getType(actions.details.imageHistoryOpenClicked):
      return state
        .setResourceId(action.payload.resourceId)
        .setLibrary(action.payload.library)
        .setLayerId(action.payload.layerId)
        .setRowId(action.payload.rowId)
        .setLoading(true)
        .setCurrentVersion()
        .setItems([])
    case getType(actions.details.imageHistoryCloseClicked):
      return new ResourceHistory()
    case getType(actions.image.history.success):
      return state
        .setItems(action.payload)
        .setLoading(false)
    case getType(actions.image.restore.failure):
      return state
        .setLoading(false)
  }
  return state
}
