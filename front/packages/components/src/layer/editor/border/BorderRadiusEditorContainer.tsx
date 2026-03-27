import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import actions from '../../../state/Actions'
import {SizeEncoding} from '@hopara/encoding'
import {LayerEditorOwnProps} from '../LayerEditor'
import {ActionProps, BorderRadiusEditor, StateProps} from './BorderRadiusEditor'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  return {
    layerId: props.layer.getId(),
    encoding: props.layer.encoding.borderRadius,
    viewState: state.viewState,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (borderRadius?: number): void => {
      const encoding = new SizeEncoding({value: borderRadius, referenceZoom: props.viewState!.zoom})
      dispatch(actions.layer.sizeEncodingChanged({type: 'borderRadius', encoding, layerId: props.layerId}))
    },
  }
}


export const BorderRadiusEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(BorderRadiusEditor)
