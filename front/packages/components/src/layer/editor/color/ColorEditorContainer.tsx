import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import ColorEditor, {ActionProps, StateProps} from './ColorEditor'
import actions from '../../../state/Actions'
import {LayerType} from '../../LayerType'
import {useMemo} from 'react'
import {getFieldOptions} from '../field/FieldOptions'
import {colorOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import {queryKeyToArray} from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const previewLayer = state.layerStore.previewLayer && state.layerStore.previewLayer.getId() === layer.getId() ? state.layerStore.previewLayer : undefined
  const encoding = useMemo(() => layer.encoding.color!, [layer.encoding.color?.getUpdatedTimestamp(), layer.type])
  const options = getFieldOptions({layer, queries, layers}, colorOptionsFilter)

  const allowOpacity = !layer.isType(LayerType.arc)
  const allowFallback = !layer.isType(LayerType.arc) && !layer.isType(LayerType.image)
  const allowDefault = encoding.isManaged()
  const allowColorSelection = !layer.isType(LayerType.image)
  const allowSaturation = layer.isType(LayerType.image)

  const columns = queries.getColumns(layer.getQueryKey())
  const positionColumns = queries.getColumns(layer.getPositionQueryKey())

  const canSetObjectAppearance = layer.canSetObjectAppearance() &&
    // We need to check the columns because old queries don't have the field
    positionColumns?.has(encoding.getManagedField())

  const allowFixed = !layer.isType(LayerType.arc) && !layer.isType(LayerType.image)

  return {
    layerId: layer.getId(),
    layerQueryColumns: useMemo(() => columns?.mergeWithKeepingOlds(positionColumns), [columns, positionColumns]),
    previewEncoding: previewLayer?.encoding.color,
    encoding,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    allowFixed,
    allowOpacity,
    allowFallback,
    allowColorSelection,
    allowSaturation,
    allowDefault,
    testId: 'select-color',
    allowOverride: !!canSetObjectAppearance,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'color', encoding, layerId: props.layerId}))
    },
    onPreview: (encoding): void => {
      dispatch(actions.layer.encodingPreview({type: 'color', encoding, layerId: props.layerId}))
    },
  }
}

export const ColorEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ColorEditor)
