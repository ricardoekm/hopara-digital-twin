import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import SizeEditor, {ActionProps, StateProps} from './SizeEditor'
import {LayerType} from '../../LayerType'
import {i18n} from '@hopara/i18n'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {SIZE_MANAGED_FIELD, SizeUnits} from '@hopara/encoding'
import {sizeOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'
import { Layer } from '../../Layer'
import { Layers } from '../../Layers'
import { VisualizationType } from '../../../visualization/Visualization'

function getSizeUnits(layer:Layer, layers: Layers) {
  if ( layer.hasParent() ) {  
    return layer.getParent(layers)?.encoding?.getUnits() ?? SizeUnits.PIXELS
  }

  return layer.encoding.getUnits()
}

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props

  const visualizationType = state.visualizationStore.visualization?.type
  const disableRange = layer.isType(LayerType.arc)
  const showResizeOption = (!layer.isModel() && !layer.isChart() && !layer.hasParent())
                            || (visualizationType !== VisualizationType.CHART && layer.isType(LayerType.line))


  let title = i18n('SIZE')
  if (layer.isType(LayerType.line)) {
    title = i18n('THICKNESS')
  }
  if (layer.isType(LayerType.arc)) {
    title = i18n('RADIUS')
  }

  const options = getFieldOptions({layer, queries, layers}, sizeOptionsFilter)

  const positionColumns = queries.findQuery(layer.getPositionQueryKey())?.columns
  const canSetObjectAppearance = layer.canSetObjectAppearance() && 
                                 // We need to check the columns because old queries don't have the field
                                 positionColumns?.has(SIZE_MANAGED_FIELD)

  return {
    layerId: layer.getId(),
    title,
    allowFixed: true,
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    maxSize: layer.isType(LayerType.line) ? 50 : undefined,
    encoding: useMemo(() => layer.encoding.size, [layer.encoding.size?.getUpdatedTimestamp(), layer.type])!,
    units: getSizeUnits(layer, layers) ?? SizeUnits.PIXELS,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    showResizeOption,
    disableRange,
    zoom: state.viewState!.zoom,
    allowOverride: !!canSetObjectAppearance,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.sizeEncodingChanged({type: 'size', encoding, layerId: props.layerId}))
    },
    onResizeChange: (enabled): void => {
      dispatch(actions.layer.resizeChanged({resize: enabled, layerId: props.layerId}))
    },
  }
}

export const SizeEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(SizeEditor)
