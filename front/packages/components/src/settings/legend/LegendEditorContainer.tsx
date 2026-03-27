import {ActionProps, LegendEditorComponent, StateProps} from './LegendEditorComponent'
import {Store} from '../../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../state/Actions'
import {SettingsMenuItemId} from '../SettingsMenu'
import {Layer} from '../../layer/Layer'
import {useMemo} from 'react'
import { Layers } from '../../layer/Layers'

function mapState(state: Store): StateProps {
  const legends = state.legends
  const isAdvancedMode = state.visualizationStore.advancedModeArea.includes(SettingsMenuItemId.COLOR_LEGENDS)

  const layersWithLegendsAvailable = useMemo(() => {
    return state.layerStore.layers.filter((l: Layer) => l?.canCreateLegend())
  }, [state.layerStore.layers])

  const customizedLegendLayers = useMemo(() => {
    return new Layers(...legends.filter((l) => !layersWithLegendsAvailable.find((layer) => layer.getId() === l.layer))
                                .map((l) => state.layerStore.layers.getById(l.layer)!))
  }, [state.layerStore.layers])

  return {
    layers: layersWithLegendsAvailable,
    customizedLegendLayers,
    legends,
    isAdvancedMode,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (legends: any): void => {
      dispatch(actions.legend.changed({legends}))
    },
    onAdvancedModeClick: (enabled: boolean) => {
      dispatch(actions.visualization.advancedModeClicked({area: SettingsMenuItemId.COLOR_LEGENDS, enabled}))
    },
  }
}

export const LegendEditorContainer = connect<StateProps, ActionProps>(mapState, mapActions)(LegendEditorComponent)

