import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, SizeMultiplierEditor, StateProps} from './SizeMultiplierEditor'
import {SizeMultiplierEncoding, SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  return {
    layer,
    encoding: layer.encoding.size as SizeMultiplierEncoding,
    units: layer.encoding.config?.units ?? SizeUnits.PIXELS,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'size', encoding, layerId: props.layer.getId()}))
    },
    handleToggleResizeChange: (event, checked): void => {
      dispatch(actions.layer.resizeChanged({
        layerId: props.layer.getId(),
        resize: checked,
      }))
    },
  }
}

export const SizeMultiplierEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(SizeMultiplierEditor)
