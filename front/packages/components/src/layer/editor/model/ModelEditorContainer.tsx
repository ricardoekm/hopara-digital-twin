import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, ModelEditor, StateProps} from './ModelEditor'
import {getFieldOptions} from '../field/FieldOptions'
import { useMemo } from 'react'
import {resourceOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const options = getFieldOptions({layer, queries, layers}, resourceOptionsFilter)

  return {
    layerId: layer.getId(),
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    encoding: useMemo(() => layer.encoding.model, [layer.encoding.model?.getUpdatedTimestamp()]),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'model', encoding, layerId: props.layerId}))
    },
    onPreview: (encoding): void => {
      dispatch(actions.layer.encodingPreview({type: 'model', encoding, layerId: props.layerId}))
    },
  }
}

export const ModelEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ModelEditor)
