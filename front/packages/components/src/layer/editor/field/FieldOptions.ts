import {Column, Queries} from '@hopara/dataset'
import {QueryKey} from '@hopara/dataset/src/query/Queries'
import {SelectOption} from '@hopara/design-system/src/form'
import {Layer} from '../../Layer'
import {Layers} from '../../Layers'
import {FieldOptionsType} from '../LayerEditorFactory'

const columnToOption = (column: Column): SelectOption => {
  return {
    value: column.name,
    label: column.getLabel(),
  }
}

export const getFieldOptionsFromQuery = (queries: Queries, queryKey?: QueryKey, filter?: (column: Column) => boolean): SelectOption[] => {
  if (!queryKey) return []
  const columns = queries.getColumns(queryKey)

  if (!filter) {
    filter = () => true
  }
  return columns.filter(filter).map(columnToOption)
}

function getTargetLayer(layer: Layer, layers: Layers) {
  if (layer.hasParent()) {
    return layers.getById(layer.parentId)
  }
  return layer
}

function getQueryKey(layer: Layer, fieldOptionsType?: FieldOptionsType) {
  if (fieldOptionsType == FieldOptionsType.QUERY) {
    return layer.getBaseQueryKey()
  } else if (fieldOptionsType == FieldOptionsType.POSITION_QUERY) {
    return layer.getPositionQueryKey()
  }
  return layer.getQueryKey()
}

export const getFieldOptions = (
  props: {
    layer: Layer,
    queries: Queries,
    layers: Layers,
    type?: FieldOptionsType
  }, predicate?: (c: Column) => boolean,
) => {
  const targetLayer = getTargetLayer(props.layer, props.layers)
  const queryKey = getQueryKey(targetLayer as Layer, props.type)
  return { fieldOptions: getFieldOptionsFromQuery(props.queries ?? new Queries(), queryKey, predicate),
           queryKey }
}

export const createGetFieldOptions = (props: {
  layer: Layer,
  queries: Queries,
  layers: Layers,
  type?: FieldOptionsType
}) => {
  return (predicate?: (c: Column) => boolean) => getFieldOptions(props, predicate)
}

