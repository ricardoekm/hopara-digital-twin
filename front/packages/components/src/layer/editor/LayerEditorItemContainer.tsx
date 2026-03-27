import {ActionProps, LayerEditorItemComponent, StateProps} from './LayerEditorItemComponent'
import actions from '../../state/Actions'
import {Store} from '../../state/Store'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'

function mapState(state: Store): StateProps {
  const selectedLayer = state.layerStore.getSelectedLayer()!
  const queries = state.queryStore.queries
  const layers = state.layerStore.layers
  const visualization = state.visualizationStore.visualization

  let selectedLayerSubItem: any
  if (state.layerStore.selectedActionId) {
    selectedLayerSubItem = {type: 'actions', id: state.layerStore.selectedActionId}
  } else if (state.layerStore.selectedDetailsField) {
    selectedLayerSubItem = {type: 'details', id: state.layerStore.selectedDetailsField}
  }

  return {
    layer: selectedLayer,
    visualization,
    queries,
    layers,
    parentLayer: state.layerStore.layers.getById(selectedLayer.parentId),
    selectedLayerSubItem,
    schema: state.schema,
    openGroups: state.layerStore.openGroups,
    isAdvancedMode: state.layerStore.isAdvancedMode,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    setOpenGroups: (groups: string[]) => {
      dispatch(actions.layer.openGroupsChanged({groups}))
    },
    onAdvancedModeClick: (enabled = false) => {
      dispatch(actions.layer.advancedModeClick({enabled}))
    },
    onBackClick: () => {
      dispatch(actions.layer.selected({id: props.layer?.parentId}))
    },
    onDeleteClick: () => {
      dispatch(actions.layer.deleted({id: props.layer.getId()}))
    },
    onDuplicateClick: () => {
      dispatch(actions.layer.duplicated({layerId: props.layer.getId()}))
    },
    onEjectClick: () => {
      dispatch(actions.layer.ejectRequested({id: props.layer.getId()}))
    },
  }
}

export const LayerEditorItemContainer = connect<StateProps, ActionProps>(mapState, mapActions)(LayerEditorItemComponent)
