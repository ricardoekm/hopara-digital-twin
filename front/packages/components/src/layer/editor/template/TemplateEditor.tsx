 
import React from 'react'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PureComponent} from '@hopara/design-system'
import {LayerTemplate, LayerTemplateConfig} from '../../template/domain/LayerTemplate'
import {Layer} from '../../Layer'
import {inferFieldPath} from './PathInference'
import {TemplateFieldEditor} from './TemplateFieldEditor'
import {Queries} from '@hopara/dataset'
import {Layers} from '../../Layers'
import Case from 'case'

function getFormRowLabel(formRow: { path: string }) {
  return Case.title(formRow.path)
}

export interface StateProps {
  layer: Layer
  layers: Layers
  queries: Queries
  loading: boolean
  template?: LayerTemplate
  templateConfig?: LayerTemplateConfig
}

export interface ActionProps {
  onConfigChange: (templateId: string, fieldPath: string, value: any) => void
}

type Props = StateProps & ActionProps

export class TemplateEditor extends PureComponent<Props> {
  render() {
    return (<>
      <PanelGroup>
        {(this.props.template?.form ?? []).map((formRow, i) => {
          const fieldPath = inferFieldPath(this.props.template?.layers, formRow.path)
          const value = this.props.templateConfig && this.props.templateConfig[formRow.path] ? this.props.templateConfig[formRow.path] : formRow.defaultValue

          return <TemplateFieldEditor
            key={formRow.path + i}
            title={getFormRowLabel(formRow)}
            fieldPath={fieldPath}
            fieldControlType={formRow.controlType}
            layer={this.props.layer}
            layers={this.props.layers}
            queries={this.props.queries}
            value={value}
            onChange={(value) => this.props.onConfigChange(this.props.template?.id!, formRow.path, value)}
          />
        })}
      </PanelGroup>
    </>)
  }
}
