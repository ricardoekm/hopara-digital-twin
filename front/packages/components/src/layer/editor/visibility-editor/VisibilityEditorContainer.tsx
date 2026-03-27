import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import VisibilityEditor, {ActionProps, StateProps} from './VisibilityEditor'
import {LayerType} from '../../LayerType'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {visibilityOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const options = getFieldOptions({layer, queries, layers}, visibilityOptionsFilter)
  const currentZoom = state.viewState?.zoom ? Number(state.viewState?.zoom.toFixed(2)) : 0

  return {
    layerId: layer.getId(),
    layerQueryColumns: state.queryStore.queries.getColumns(layer.getQueryKey()),
    showCondition: !layer.isType(LayerType.map),
    showToggle: !layer.hasParent(),
    showZoomRange: !layer.hasParent() || layer.isType(LayerType.composite),
    visible: useMemo(() => layer.visible, [layer.visible.getUpdatedTimestamp()]),
    zoom: currentZoom,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    maxZoom: state.viewState?.zoomRange?.getMax() ?? 0,
    minZoom: state.viewState?.zoomRange?.getMin() ?? 0,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (visible): void => {
      dispatch(actions.layer.visibilityChanged({id: props.layerId, visible}))
    },
  }
}

export const VisibilityEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(VisibilityEditor)
