import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, ActionsEditor, StateProps} from '../../../action/editor/ActionsEditor'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  return {
    layer,
    items: layer.actions,
    sublist: true,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onItemClick: (actionId): void => {
      dispatch(actions.layer.selectAction({actionId}))
    },
    newActionClick: (): void => {
      dispatch(actions.layer.newActionRequested())
    },
    onDelete: (actionId): void => {
      dispatch(actions.layer.actionDeleted({actionId}))
    },
    onMove: ({sourceIndex, destinationIndex}): void => {
      dispatch(actions.layer.actionMoved({sourceIndex, destinationIndex}))
    },
  }
}

export const ActionsEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ActionsEditor)
