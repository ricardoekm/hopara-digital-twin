import {Dispatch} from '@reduxjs/toolkit'
import {ActionProps, NameEditor, StateProps} from './NameEditor'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  return {
    layerId: layer.getId(),
    value: layer.name,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (name): void => {
      dispatch(actions.layer.changed({id: props.layerId, change: {name}}))
    },
  }
}

export const NameEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(NameEditor)
