import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import actions from '../../../state/Actions'
import {ColorEncoding} from '@hopara/encoding'
import ColorEditor, {ActionProps, StateProps} from '../color/ColorEditor'
import {i18n} from '@hopara/i18n'
import {useMemo} from 'react'
import {getFieldOptions} from '../field/FieldOptions'
import {colorOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import {queryKeyToArray} from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const previewLayer = state.layerStore.previewLayer && state.layerStore.previewLayer.getId() === layer.getId() ? state.layerStore.previewLayer : undefined
  const encoding = useMemo(() => new ColorEncoding(layer.encoding.strokeColor), [layer.encoding.strokeColor?.getUpdatedTimestamp()])

  const options = getFieldOptions({layer, queries, layers}, colorOptionsFilter)
  const layerQueryColumns = queries.getColumns(layer.getData().getQueryKey())

  return {
    layerId: layer.getId(),
    previewEncoding: previewLayer?.encoding.strokeColor,
    encoding,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    allowFixed: true,
    allowOpacity: true,
    allowFallback: true,
    allowColorSelection: true,
    allowSaturation: false,
    title: i18n('BORDER_COLOR'),
    layerQueryColumns,
    testId: 'border-color-select',
    allowOverride: false,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'strokeColor', encoding, layerId: props.layerId}))
    },
    onPreview: (encoding): void => {
      dispatch(actions.layer.encodingPreview({type: 'strokeColor', encoding, layerId: props.layerId}))
    },
  }
}

export const BorderColorEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ColorEditor)
