import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {PositionEditor, ActionProps, StateProps} from './PositionEditor'
import {ColumnType, NULL_COLUMNS, queryKeyToArray} from '@hopara/dataset'
import {FieldOptionsType} from '../LayerEditorFactory'
import actions from '../../../state/Actions'
import {shouldRenderLayerEditor} from '../selectors'
import {createGetFieldOptions} from '../field/FieldOptions'
import { useMemo } from 'react'
import {LayerEditorOwnProps} from '../LayerEditor'
import { PositionType } from '@hopara/encoding/src/position/PositionEncoding'
import { LayerType } from '../../LayerType'
import { getRefLayerFilter } from './RefLayerFilter'
import { isDataRef } from '@hopara/encoding/src/data/DataRef'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const columns = queries.getColumns(layer.getPositionQueryKey())
  const visualization = state.visualizationStore.visualization
  const getFieldOptions = createGetFieldOptions({layer, queries, layers, type: FieldOptionsType.POSITION_QUERY})
  const refLayerOptions = useMemo(() => {
      return state.layerStore.layers.filter(getRefLayerFilter(layer))
  }, [state.layerStore.layers])

  const coordinatesOptions = getFieldOptions((column) =>
    column.isGeometry() || (layer.isType(LayerType.polygon) && (column.isType(ColumnType.JSON) || column.isType(ColumnType.STRING))),
  )

  const xyzOptions = getFieldOptions((column) =>
    column.isQuantitative() ||
    column.isGeometry() ||
    column.isTemporal() ||
    (layer.allowCategoricalAxis() && column.isCategorical()),
  )

  const floorOptions = getFieldOptions((column) =>
    column.isQuantitative() ||
    column.isType(ColumnType.STRING),
  )

  const positionEncoding = layer.encoding.position
  const refLayerId = isDataRef(positionEncoding?.data) ? positionEncoding?.data.layerId : undefined
  const refLayer = refLayerId ? state.layerStore.layers.flatLayers().find((l) => l.getId() === refLayerId) : undefined
  const refLayerIsCoordinatesBased = refLayer?.isCoordinatesBased() ?? false

  return {
    visualizationScope: visualization.scope!,
    layerId: layer.getId(),
    layerType: layer.type,
    positionQueryColumns: columns,
    coordinatesOptions: useMemo(() => coordinatesOptions.fieldOptions, [queries, ...queryKeyToArray(coordinatesOptions.queryKey)]),
    xyzOptions: useMemo(() => xyzOptions.fieldOptions, [queries, ...queryKeyToArray(xyzOptions.queryKey)]),
    floorOptions: useMemo(() => floorOptions.fieldOptions, [queries, ...queryKeyToArray(floorOptions.queryKey)]),
    hasPrimaryKey: columns === NULL_COLUMNS ? undefined : columns.hasPrimaryKey(),
    visualizationType: visualization.type,
    encoding: layer.encoding.position,
    layerData: layer.data,
    refLayerOptions,
    refLayerIsCoordinatesBased,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (position): void => {
      dispatch(actions.layer.positionEncodingChanged({type: 'position', encoding: position, layerId: props.layerId}))
    },
    onTypeChange: (type: PositionType): void => {
      dispatch(actions.layer.positionTypeChanged({layerId: props.layerId, type}))
    },
  }
}

export const PositionEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(PositionEditor)
