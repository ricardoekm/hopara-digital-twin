import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, ImageEditor, StateProps} from './ImageEditor'
import actions from '../../../state/Actions'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {resourceOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const options = getFieldOptions({layer, queries, layers}, resourceOptionsFilter)

  return {
    layerId: layer.getId(),
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    encoding: useMemo(() => layer.encoding.image, [layer.encoding.image?.getUpdatedTimestamp()]),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'image', encoding, layerId: props.layerId}))
    },
  }
}

export const ImageEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ImageEditor)
