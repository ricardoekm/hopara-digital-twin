import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, StateProps, LineEditor} from './LineEditor'
import {LineEncoding} from '@hopara/encoding'
import {DEFAULT_SEGMENT_LENGTH} from '../../EncodingAnimation'
import {LayerEditorOwnProps} from '../LayerEditor'
import { useMemo } from 'react'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  return {
    layerId: layer.getId(),
    encoding: useMemo(() => new LineEncoding(layer.encoding.line ?? {}), [layer.encoding.line?.getUpdatedTimestamp()]),
    enabled: (layer.encoding.line?.segmentLength ?? 0) > 0,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (lineEncoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'line', encoding: lineEncoding, layerId: props.layerId}))
    },
    onEnabledChange: (enabled): void => {
      const encoding = new LineEncoding({
        ...props.encoding,
        segmentLength: enabled ? DEFAULT_SEGMENT_LENGTH : 0,
      })
      dispatch(actions.layer.encodingChanged({type: 'line', encoding, layerId: props.layerId}))
    },
  }
}

function shouldRender(store:Store) {
  return shouldRenderLayerEditor(store) && !store.visualizationStore.visualization.isChart()
}

export const LineEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRender)(LineEditor)
