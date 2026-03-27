import {getType, isActionOf} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import {ResourceHistory, RowHistory, RowHistoryStore, ResourceHistoryType, RowSavedStatus} from './RowHistoryStore'
import { Reducer } from '@hopara/state'
import { Store } from '../state/Store'

const getRowHistory = (action: ReturnType<
  typeof actions.viewLayer.dragEnded |
  typeof actions.object.unplaced |
  typeof actions.object.placed |
  typeof actions.fit.fitToImage.request |
  typeof actions.fit.fitToRoom.request |
  typeof actions.fit.fitToBuilding.request
>, globalState: Store): RowHistory => {
  const rowset = globalState.rowsetStore.getRowset(action.payload.rowsetId)
  const stateRow = rowset?.getRow(action.payload.row._id!)
  const row = stateRow ? stateRow : action.payload.row

  return {
    layerId: action.payload.layerId,
    rowsetId: action.payload.rowsetId,
    row,
  }
}

const getResourceHistory = (action: ReturnType<
  typeof actions.image.upload.success |
  typeof actions.image.restore.success |
  typeof actions.model.upload.success |
  typeof actions.model.restore.success |
  typeof actions.image.crop.success | 
  typeof actions.image.generateIsometric.success |
  typeof actions.image.generateIsometricWireframe.success
>): ResourceHistory => {
  return {
    layerId: action.payload.layerId,
    rowsetId: action.payload.rowsetId,
    row: action.payload.row,
    version: action.payload.version,
    type: isActionOf([actions.model.upload.success, actions.model.restore.success], action) ? ResourceHistoryType.model : ResourceHistoryType.image,
  }
}

export const rowHistoryReducer: Reducer<RowHistoryStore, ActionTypes> = (state = new RowHistoryStore(), action, globalState) => {
  switch (action.type) {
    case getType(actions.visualization.pageLoaded):
    case getType(actions.settings.pageLoaded):
    case getType(actions.objectEditor.pageLoaded):
    case getType(actions.layerEditor.pageLoaded):
      return new RowHistoryStore()
    case getType(actions.rowHistory.rowUndoRequested):
    case getType(actions.rowHistory.imageUndoRequested):
    case getType(actions.rowHistory.modelUndoRequested):
      return state.removeLast()
    case getType(actions.rowset.rowSave.failure):
    case getType(actions.object.placeAtUserLocation.failure):
    case getType(actions.fit.fitToImage.failure):
      return state
        .setStatus(RowSavedStatus.idle)
        .removeLast()
    case getType(actions.viewLayer.dragEnded):
    case getType(actions.object.unplaced):
    case getType(actions.object.placed):
      return state
        .push(getRowHistory(action, globalState))
        .setStatus(RowSavedStatus.saving)
    case getType(actions.fit.fitToImage.request):
    case getType(actions.fit.fitToRoom.request):
    case getType(actions.fit.fitToBuilding.request):
      return state
      .push(getRowHistory(action, globalState))
      .setStatus(RowSavedStatus.fitting)
    case getType(actions.image.upload.success):
    case getType(actions.image.restore.success):
    case getType(actions.model.upload.success):
    case getType(actions.model.restore.success):
    case getType(actions.image.crop.success):
    case getType(actions.image.generateIsometric.success):
    case getType(actions.image.generateIsometricWireframe.success):
      if (action.payload.cascadeToSameKey != undefined) return state
      return state
        .push(getResourceHistory(action))
        .setStatus(RowSavedStatus.saved)
    case getType(actions.object.placeClickedMobile):
    case getType(actions.rowset.rowSave.request):
    case getType(actions.object.undoRequest):
      return state.setStatus(RowSavedStatus.saving)
    case getType(actions.rowset.rowSave.success):
    case getType(actions.model.undo.success):
      return state.setStatus(RowSavedStatus.saved)
    default:
      return state
  }
}
