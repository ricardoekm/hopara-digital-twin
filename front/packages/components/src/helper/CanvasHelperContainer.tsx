import React from 'react'
import { connect } from '@hopara/state'
import { Store } from '../state/Store'
import { CanvasHelperActions, CanvasHelperComponent, CanvasHelperProps } from './CanvasHelperComponent'
import actions from '../state/Actions'
import { Internals } from '@hopara/internals'
import {Layer} from '../layer/Layer'

const layerToShow = (helpersHidden:string[], isOnObjectEditor:boolean) => (layer:Layer) => {
  if (!layer.helperText) return false
  if (Internals.getParam('advanced') === true) return true
  if (isOnObjectEditor) return false
  return !helpersHidden.includes(layer.getId())
}

const mapState = (state: Store): CanvasHelperProps => {
  const firstVisibleLayerWithHelper = React.useMemo(() => {
    if (Internals.getParam('test') === true) return undefined

    const helpersHidden = Object.keys(state.layerHelper.items).filter((layerId) => state.layerHelper.items[layerId].shouldHide())
    const visibleLayers = state.layerStore.layers.getVisibles(state.viewState?.zoom)
    return visibleLayers.find(layerToShow(helpersHidden, state.visualizationStore.isOnObjectEditor()))
  }, [
    state.layerHelper,
    state.layerStore.layers,
    state.viewState?.zoom.toFixed(1),
    state.visualizationStore.area,
  ])

  return {
    isBrowserSupported: state.browser.platform.isSupported,
    isWebGLSupported: state.browser.isWebGLSupported(),
    isWebGLEnabled: state.browser.isWebGLEnabled(),
    helperText: firstVisibleLayerWithHelper?.helperText,
    helperLayerId: firstVisibleLayerWithHelper?.getId(),
    isOnSettings: state.visualizationStore.isOnSettings(),
    visible: state.navigation.visible,
  }
}

const mapActions = (dispatch): CanvasHelperActions => ({
  onHelperDismissed: (layerId) => dispatch(actions.layerHelper.onHelperDismissed({layerId})),
  onHelperLoaded: (layerId) => dispatch(actions.layerHelper.onHelperLoaded({layerId})),
})

export const CanvasHelperContainer = connect(mapState, mapActions)(CanvasHelperComponent)
