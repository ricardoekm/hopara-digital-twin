import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, AnimationEditor, StateProps} from './AnimationEditor'
import { getFieldOptions } from '../field/FieldOptions'
import { useMemo } from 'react'
import {visibilityOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'
import { AnimationEncoding } from '@hopara/encoding'

function mapState(_: Store, props:LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const options = getFieldOptions({layer, queries, layers}, visibilityOptionsFilter)

  return {
    layerId: layer.getId(),
    encoding: useMemo(() => layer.encoding.animation ?? new AnimationEncoding({}), [layer.encoding.animation?.getUpdatedTimestamp()]),
    layerType: props.layer.type,
    visualizationType: props.visualization.type,
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (animation): void => {
      dispatch(actions.layer.animationChanged({type: 'animation', encoding: animation, layerId: props.layerId}))
    },
  }
}

export const AnimationEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(AnimationEditor)
