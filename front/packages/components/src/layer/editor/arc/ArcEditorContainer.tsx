import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import ArcEditor, {ActionProps, StateProps} from './ArcEditor'
import { getFieldOptions } from '../field/FieldOptions'
import { useMemo } from 'react'
import {sizeOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const options = getFieldOptions({layer, queries, layers}, sizeOptionsFilter)

  return {
    layerId: layer.getId(),
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    encoding: useMemo(() => layer.encoding.arc, [layer.encoding.arc?.getUpdatedTimestamp()]),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'arc', encoding, layerId: props.layerId}))
    },
  }
}

export const ArcEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ArcEditor)
