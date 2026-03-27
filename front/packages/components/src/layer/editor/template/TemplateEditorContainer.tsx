import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, StateProps, TemplateEditor} from './TemplateEditor'
import actions from '../../../state/Actions'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, layers, queries} = props
  const templates = state.layerTemplate.layerTemplates ?? []
  const template = templates.find((template) => template.id === layer.template?.id)
  return {
    layer,
    layers,
    queries,
    loading: state.layerTemplate.loading,
    template,
    templateConfig: layer.template,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onConfigChange: (templateId: string, fieldPath: string, value: any) => {
      dispatch(actions.layerTemplate.configChanged({fieldPath, value, layerId: props.layer.getId(), templateId}))
    },
  }
}

export const TemplateEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(TemplateEditor)
