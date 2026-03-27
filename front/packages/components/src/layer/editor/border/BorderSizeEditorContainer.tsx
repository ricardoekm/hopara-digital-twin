import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import SizeEditor, {ActionProps, StateProps} from '../size/SizeEditor'
import actions from '../../../state/Actions'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {i18n} from '@hopara/i18n'
import {SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {sizeOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'
import { LayerType } from '../../LayerType'
import { Layer } from '../../Layer'
import { Layers } from '../../Layers'

function getSizeUnits(layer:Layer, layers: Layers) {
  if ( layer.isType(LayerType.icon) ) {
    return SizeUnits.PIXELS
  }

  if ( layer.hasParent() ) {  
    return layer.getParent(layers)?.encoding?.getUnits() ?? SizeUnits.PIXELS
  }

  return layer.encoding.getUnits()
}

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const encoding = layer.encoding.strokeSize
  const layerQueryColumns = queries.getColumns(layer.getData().getQueryKey())
  const options = getFieldOptions({layer, queries, layers}, sizeOptionsFilter)
  const units = getSizeUnits(layer, layers) ?? SizeUnits.PIXELS

  return {
    layerId: layer.getId(),
    encoding: encoding!,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    disableRange: false,
    zoom: state.viewState!.zoom,
    title: i18n('BORDER_SIZE'),
    minSize: 0,
    maxSize: layer.isType(LayerType.icon) ? 10 : 30,
    units,
    showResizeOption: layer.isCoordinatesBased(),
    layerQueryColumns,
    allowFixed: true,
    allowOverride: false,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'strokeSize', encoding, layerId: props.layerId}))
    },
    onResizeChange: (enabled): void => {
      dispatch(actions.layer.resizeChanged({resize: enabled, layerId: props.layerId}))
    },
  }
}

export const BorderSizeEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(SizeEditor)
