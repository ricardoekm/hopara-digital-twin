import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import ShadowEditor, {ActionProps, StateProps} from './ShadowEditor'
import actions from '../../../state/Actions'
import {ShadowEncoding} from '@hopara/encoding/src/shadow/ShadowEncoding'
import {LayerEditorOwnProps} from '../LayerEditor'
import { useMemo } from 'react'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  const encoding = useMemo(() => new ShadowEncoding(layer.encoding.shadow), [layer.encoding.shadow?.getUpdatedTimestamp()])

  return {
    layerId: layer.getId(),
    encoding,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'shadow', encoding, layerId: props.layerId}))
    },
  }
}

export const ShadowEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ShadowEditor)
