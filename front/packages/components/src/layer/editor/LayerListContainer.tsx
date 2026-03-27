import {Layer} from '../Layer'
import actions from '../../state/Actions'
import {Store} from '../../state/Store'
import {DefaultLayerTypeByWorld} from '../LayerType'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {ActionProps, LayerListPanel, StateProps} from './LayerListPanel'

function mapState(state: Store): StateProps {
  const selectedLayer = state.layerStore.getSelectedLayer()
  return {
    visualization: state.visualizationStore.visualization,
    layers: state.layerStore.layers,
    selectedLayerId: state.layerStore.editingId,
    schema: state.schema,
    visualizationStatus: state.visualizationStore.editStatus,
    parentLayer: selectedLayer ? state.layerStore.layers.getById(selectedLayer.parentId) : undefined,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onNewClick: (partialLayer: Partial<Layer> | undefined, type?: string, parentId?: string): void => {
      const layerType = type ?? DefaultLayerTypeByWorld[props.visualization!.type]
      dispatch(actions.layer.created({type: layerType, partialLayer, parentId}))
    },

    onClick: (id: string) => {
      dispatch(actions.layer.selected({id}))
    },

    onMove: (id: string, steps: number) => {
      dispatch(actions.layer.moved({id, steps}))
    },

    onDeleteClick: (id: string) => {
      dispatch(actions.layer.deleted({id}))
    },

    onDuplicateClick: (layerId: string) => {
      dispatch(actions.layer.duplicated({layerId}))
    },

    onEditInAdvancedModeClick: (layer: Layer) => {
      dispatch(actions.layer.selected({id: layer.getId()}))
      dispatch(actions.layer.advancedModeClick({enabled: true}))
    },
    onEjectClick: (id: string) => {
      dispatch(actions.layer.ejectRequested({id}))
    },
    onHistoryClick: () => {
      dispatch(actions.visualizationHistory.open())
    },
  }
}

export const LayerListContainer = connect<StateProps, ActionProps>(mapState, mapActions)(LayerListPanel)
