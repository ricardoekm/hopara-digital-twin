import actions, { ActionTypes } from '../state/Actions'
import { getType } from 'typesafe-actions'
import { ViewLayerEditingMode, ViewLayerStore } from './ViewLayerStore'
import { Store } from '../state/Store'
import { LayerType } from '../layer/LayerType'
import { Reducer } from '@hopara/state'
import { LayerStore } from '../layer/state/LayerStore'
import QueryStore from '../query/QueryStore'
import { getSelectedLayer } from './deck/interaction/RowSelection'

const setSelectedFromLayerAndRow = (
  layerId: string | undefined,
  rowId: string | undefined,
  state: ViewLayerStore,
  globalState: Store
): ViewLayerStore => {
  const parentLayer = globalState.layerStore.layers.getById(layerId)
  if (!parentLayer) return state

  const rowsetId = parentLayer.getRowsetId()
  return state.setRowSelection(
    layerId,
    parentLayer.getId(),
    rowsetId,
    rowId
  )
}

const isLayerSelected = (state: ViewLayerStore, payload: any) => {
  return state.rowSelection?.layerId === payload.layerId &&
    state.rowSelection?.rowsetId === payload.rowsetId &&
    state.rowSelection?.rowId === payload.row._id
}

const shouldUnselectOnDetailsBack = (state: ViewLayerStore, globalState: Store) => {
  if (!state.rowSelection) return false
  const row = globalState.rowsetStore.getRowset(state.rowSelection.rowsetId)?.rows.getById(state.rowSelection.rowId)
  return !row?.isPlaced()
}

export const viewLayerReducer: Reducer<ViewLayerStore, ActionTypes> = (state = new ViewLayerStore(), action, globalState) => {
  switch (action.type) {
    case getType(actions.visualization.pageLoaded):
    case getType(actions.settings.pageLoaded):
    case getType(actions.layerEditor.pageLoaded):
    case getType(actions.layer.changed):
    case getType(actions.layer.encodingChanged):
    case getType(actions.layer.sizeEncodingChanged):
    case getType(actions.layer.positionEncodingChanged):
    case getType(actions.layer.positionTypeChanged):
    case getType(actions.layer.codeChanged):
    case getType(actions.object.unplaced):
    case getType(actions.object.create.success):
    case getType(actions.objectEditor.lockToggleRequested):
      return new ViewLayerStore(undefined, state.editingMode)
    case getType(actions.objectEditor.pageLoaded):
      return setSelectedFromLayerAndRow(
        globalState.details?.layerId,
        globalState.details?.row?.getId(),
        new ViewLayerStore(),
        globalState
      )
    case getType(actions.details.backClicked):
      if (shouldUnselectOnDetailsBack(state, globalState)) return new ViewLayerStore(undefined, state.editingMode)
      return state
    case getType(actions.object.placed):
      return setSelectedFromLayerAndRow(
        globalState.details?.layerId ?? globalState.objectMenu?.selectedId,
        action.payload.row?.getId(),
        state,
        globalState
      )
    case getType(actions.viewLayer.dragEnded):
      if (!isLayerSelected(state, action.payload)) {
        return state.setRowSelection(
          action.payload.layerId,
          action.payload.parentId,
          action.payload.rowsetId,
          action.payload.row._id
        )
      }
      return state
    case getType(actions.viewLayer.click): {
      const layer = (globalState.layerStore as LayerStore).layers.getById(action.payload.layerId, false)
      const positionQuery = (globalState.queryStore as QueryStore).queries.findQuery(layer!.getPositionQueryKey())

      if (!globalState.visualizationStore.isOnObjectEditor() || !layer!.canSelect(positionQuery?.canUpdate())) return state

      return state
        .setRowSelection(
          action.payload.layerId,
          action.payload.parentId,
          action.payload.rowsetId,
          action.payload.row._id
        )
    }
    case getType(actions.viewLayer.clickOut): {
      const layer = (globalState.layerStore as LayerStore).layers.getById(state.rowSelection?.layerId, false)
      const updatedState = new ViewLayerStore(undefined, state.editingMode)
      if (layer?.type && state.getEditingMode(layer?.type) === ViewLayerEditingMode.CROP) return updatedState.setEditingMode(layer?.type, undefined)
      return updatedState
    }
    case getType(actions.navigation.searchRowClicked):
    case getType(actions.object.click): {
      if (action.payload.row.isPlaced()) {
        return state.setRowSelection(
          action.payload.layer.getId(),
          action.payload.layer.parentId,
          action.payload.layer.getRowsetId(),
          action.payload.row._id)
      } else {
        return state.resetRowSelection()
      }
    }
    case getType(actions.object.zIndexUpdated):
      // The selected object shows always on top
      // we'll reset so the user have feedback
      return state.resetRowSelection()
    case getType(actions.rowToolbar.onViewLayerEditModeClicked):
      return state.setEditingMode(
        getSelectedLayer(globalState.viewLayers.rowSelection, globalState.layerStore?.layers)?.type,
        action.payload.mode
      )
    case getType(actions.fit.fitToCrop.success):
    case getType(actions.fit.fitToCrop.failure):
      return state.setCrop({
        row: action.payload.row,
        layerId: action.payload.layerId,
        rowsetId: action.payload.rowsetId,
        bounds: action.payload.fitBox
      })
    case getType(actions.viewLayer.cropEditEnd):
      return state.setCrop(action.payload)
    case getType(actions.viewLayer.cropCancelClicked):
      return state.setCrop(undefined).setEditingMode(LayerType.image, undefined)
    case getType(actions.viewLayer.cropApplyClicked):
      return state.setCrop({ ...state.crop, status: 'cropping' })
    case getType(actions.image.crop.success):
    case getType(actions.image.crop.failure):
      return state.setCrop(undefined).setEditingMode(LayerType.image, undefined)
    case getType(actions.object.delete.success):
      if (isLayerSelected(state, action.payload)) {
        return new ViewLayerStore(undefined, state.editingMode)
      }
      return state
    case getType(actions.rowToolbar.isometricImageLoaded):
      return state.setAllowRotation(action.payload.isometricImageLoaded)
    case getType(actions.rowToolbar.imageLoaded):
      return state.setAllowImageEdit(action.payload.imageLoaded)
    default:
      return state
  }
}
