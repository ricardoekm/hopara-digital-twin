import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, ChildrenEditor, StateProps} from './ChildrenEditor'
import {DefaultLayerTypeByWorld, composableLayerTypes} from '../../LayerType'
import actions from '../../../state/Actions'
import {Layers} from '../../Layers'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, visualization} = props

  return {
    layer,
    visualization,
    items: layer.children ?? [],
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (children): void => {
      dispatch(actions.layer.orderChanged({layerId: props.layer.getId(), children: new Layers(...children)}))
    },
    onNewLayerClick: (parentId?: string): void => {
      const partialLayer = {}
      const layerType = parentId ? composableLayerTypes[0] : DefaultLayerTypeByWorld[props.visualization.type]
      dispatch(actions.layer.created({type: layerType, partialLayer, parentId}))
    },
    onItemClick: (id: string) => {
      dispatch(actions.layer.selected({id}))
    },
    onItemAdvancedModeClick: (id: string) => {
      dispatch(actions.layer.selected({id}))
      dispatch(actions.layer.advancedModeClick({enabled: true}))
    },
    onDeleteClick: (id: string) => {
      dispatch(actions.layer.deleted({id}))
    },
    onDuplicateClick: (id: string) => {
      dispatch(actions.layer.duplicated({layerId: id}))
    },
  }
}

export const ChildrenEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ChildrenEditor)
