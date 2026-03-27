import actions, {ActionTypes} from '../state/Actions'
import {getType} from 'typesafe-actions'
import { LayerHelperStore } from './LayerHelperStore'
import { Layers } from '../layer/Layers'
import { Reducer } from '@hopara/state'
import {Layer} from '../layer/Layer'

const resetStateWithLayerEditorData = (state: LayerHelperStore, layers: Layers) => {
  const layersWithHelper = layers.filter((layer: Layer) => !!layer.helperText)
  if (!layersWithHelper.length) return state
  return layersWithHelper.reduce((acc, layer) => acc.resetLayer(layer.getId()), state)
}

export const layerHelperReducer: Reducer<LayerHelperStore, ActionTypes> = (state = new LayerHelperStore(), action, globalState) => {
  if (!state) return new LayerHelperStore()

  switch (action.type) {
    case getType(actions.layerHelper.initialized):
      return state.setInitialViewedCounts(action.payload)
    case getType(actions.layerHelper.onHelperDismissed):
      return state.setDismissed(action.payload.layerId)
    case getType(actions.layerHelper.onHelperLoaded):
      return state.setLoadCount(action.payload.layerId)
    case getType(actions.layerEditor.pageLoaded):
      return resetStateWithLayerEditorData(state, globalState.layerStore.layers)
    default:
      return state
  }
}

