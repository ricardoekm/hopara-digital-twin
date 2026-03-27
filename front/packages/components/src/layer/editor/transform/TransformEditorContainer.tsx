import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import TransformEditor, {ActionProps, StateProps} from './TransformEditor'
import {FieldOptionsType} from '../LayerEditorFactory'
import {shouldRenderLayerEditor} from '../selectors'
import {createGetFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {Query, queryKeyToArray} from '@hopara/dataset'
import {VisualizationType} from '../../../visualization/Visualization'
import {LayerEditorOwnProps} from '../LayerEditor'
import { LayerType } from '../../LayerType'

const transformsPermissions = {
  'CLUSTER': {
    visualizations: [VisualizationType.GEO],
  },
  'NEIGHBOR_COUNT': {
    visualizations: [VisualizationType.GEO],
  },
  'UNIT': {
    visualizations: [VisualizationType.CHART],
    layers: [LayerType.bar],
  },
}

function getTransformTypes(query: Query | undefined, visualizationType: VisualizationType, layerType: LayerType): string[] {
  if (!query) {
    return []
  }

  return query.transforms?.filter((transform) => {
    const permissions = transformsPermissions[transform.type]
    if (!permissions) return false
    const isVisualizationPermited = permissions.visualizations?.length ? permissions.visualizations.includes(visualizationType) : true
    const isLayerPermited = permissions.layers?.length ? permissions.layers.includes(layerType) : true
    return isVisualizationPermited && isLayerPermited
  }).map((t) => t.type).sort()
}

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, visualization} = props
  const getFieldOptions = createGetFieldOptions({
    layer,
    queries,
    layers: state.layerStore.layers,
    type: FieldOptionsType.QUERY,
  })
  const notComplexOptions = getFieldOptions((column) => !column.isComplex())
  const coordinatesOptions = getFieldOptions((column) => column.isGeometry())

  const query = queries.findQuery(layer.getData() as any)
  const dataSource = query?.getDataSource() ?? layer.getData().source
  const transformTypes = useMemo(() => getTransformTypes(query, visualization.type, layer.type), [query, visualization.type, layer.type])

  return {
    layer,
    dataSource,
    layerQueryColumns: query?.columns,
    layers: state.layerStore.layers,
    transform: layer.data.transform,
    options: transformTypes,
    queries: state.queryStore.queries,
    notComplexOptions: useMemo(() => notComplexOptions.fieldOptions, [queries, ...queryKeyToArray(notComplexOptions.queryKey)]),
    coordinatesOptions: useMemo(() => coordinatesOptions.fieldOptions, [queries, ...queryKeyToArray(coordinatesOptions.queryKey)]),
    visible: !!transformTypes.length,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (transform): void => {
      dispatch(actions.layer.transformChanged({id: props.layer.getId(), transform}))
    },
  }
}

export const TransformEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(TransformEditor)
