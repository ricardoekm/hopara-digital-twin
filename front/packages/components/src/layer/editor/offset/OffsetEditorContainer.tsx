import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {ActionProps, OffsetEditor, StateProps} from './OffsetEditor'
import {shouldRenderLayerEditor} from '../selectors'
import { useMemo } from 'react'
import {SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'
import {LayerEditorOwnProps} from '../LayerEditor'
import { isDataRef } from '@hopara/encoding/src/data/DataRef'
import { Layers } from '../../Layers'
import { Layer } from '../../Layer'

function supportsAnchor(layers: Layers, layer: Layer): boolean {
  const positionEncoding = layer.encoding.position
  if ( !isDataRef(positionEncoding?.data) ) {
    return false
  }

  const refLayer = layers.getById(positionEncoding?.data.layerId, false)
  return !!refLayer?.isCoordinatesBased()
}

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, layers} = props
  const parent = layer.parentId ? layers.getById(layer.parentId) : undefined
  const isChildLayer = !!layer.parentId

  return {
    layerId: layer.getId(),
    multiplier: parent?.encoding.size?.getMultiplier() ?? 1,
    offsetEncoding: useMemo(() => layer.encoding.offset, [layer.encoding.offset?.getUpdatedTimestamp()]),
    zoom: state.viewState!.zoom,
    units: (layer.hasParent() ? layer.getParent(layers)?.encoding?.getUnits() : layer.encoding.getUnits()) ?? SizeUnits.PIXELS,
    maxResizeZoom: layer.encoding.config?.maxResizeZoom ?? layer.getParent(layers)?.encoding?.config?.maxResizeZoom,
    supportsAnchor: supportsAnchor(layers, layer),
    isChildLayer,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (offset): void => {
      dispatch(actions.layer.offsetEncodingChanged({encoding: offset, layerId: props.layerId}))
    },
  }
}

export const OffsetEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(OffsetEditor)
