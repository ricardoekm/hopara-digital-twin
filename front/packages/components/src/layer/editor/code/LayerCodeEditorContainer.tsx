import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, LayerCodeEditor, StateProps} from './LayerCodeEditor'
import {LayerEditorOwnProps} from '../LayerEditor'
import { VisualizationEditStatus } from '../../../visualization/VisualizationEditStatus'
import { useMemo } from 'react'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const discared = state.visualizationStore.editStatus === VisualizationEditStatus.DISCARDED
  const layerVersion = useMemo(() => discared ? props.layer.getLastModified()!.toString() : '', [discared])

  return {
    layer: props.layer,
    schema: state.schema,
    layerVersion,
   }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (layer): void => {
      dispatch(actions.layer.changed({id: layer.getId(), change: layer}))
    },
  }
}

export default connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(LayerCodeEditor)
