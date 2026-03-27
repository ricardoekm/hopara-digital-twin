import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import TypeEditor, {ActionProps, StateProps} from './TypeEditor'
import {i18n} from '@hopara/i18n'
import {
  composableLayerTypes,
  DefaultLayerTypeByWorld,
  getLayerTypesByVisualization,
  LayerType,
  LayerTypeStr,
} from '../../LayerType'
import {SelectOption} from '@hopara/design-system/src/form/Select'
import Case from 'case'
import {Layer} from '../../Layer'
import Visualization from '../../../visualization/Visualization'
import {shouldRenderLayerEditor} from '../selectors'
import {useMemo} from 'react'
import {LayerEditorOwnProps} from '../LayerEditor'

const getLayerTypes = (props: { layer: Layer, visualization: Visualization }): LayerType[] => {
  if (props.layer.hasParent()) {
    return [...composableLayerTypes].sort()
  }
  
  return getLayerTypesByVisualization(props.visualization.type)
}

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, visualization} = props
  const allowedLayerTypes = getLayerTypesByVisualization(visualization.type)
  const templates = state.layerTemplate.layerTemplates.filterAllowed(allowedLayerTypes)
  const template = templates.find((template) => template.id === layer.template?.id)

  return {
    visualization,
    templates,
    template,
    type: layer.type,
    options: useMemo(() => getLayerTypes({layer, visualization}).map((type) => ({
      value: type,
      label: Case.title(i18n('LAYER_' + type.toUpperCase() as LayerTypeStr)),
    } as SelectOption)), [layer.getId(), visualization]),
    layerId: layer.getId(),
    layerType: layer.type,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (type) => {
      dispatch(actions.layer.typeChanged({
        type: (type ?? DefaultLayerTypeByWorld[props.visualization.type]) as LayerType,
        id: props.layerId,
      }))
    },
    onTemplateTypeChange: (templateId: string) => {
      dispatch(actions.layerTemplate.typeChanged({templateId, layerId: props.layerId}))
    },
  }
}


export const TypeEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(TypeEditor)
