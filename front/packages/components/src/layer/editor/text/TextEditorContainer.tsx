import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, StateProps, TextEditor} from './TextEditor'
import {TextEncoding} from '@hopara/encoding'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {notComplexOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, layers, queries} = props
  const options = getFieldOptions({layer, queries, layers}, notComplexOptionsFilter)

  return {
    layerId: layer.getId(),
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    encoding: useMemo(() => new TextEncoding(layer.encoding.text ?? {}), [layer.encoding.text?.getUpdatedTimestamp()]),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (name): void => {
      dispatch(actions.layer.encodingChanged({type: 'text', encoding: name, layerId: props.layerId}))
    },
  }
}

export const TextEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(TextEditor)
