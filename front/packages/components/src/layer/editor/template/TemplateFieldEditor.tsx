import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {getFieldOptions} from '../field/FieldOptions'
import {Layer} from '../../Layer'
import {Layers} from '../../Layers'
import {Queries} from '@hopara/dataset'
import {getFieldOptionsFromPath} from '../../../OptionsFilters'
import FieldEditor from '../field/FieldEditor'
import {IconSelect} from '../../../resource/IconSelect'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {ColorPicker} from '@hopara/design-system/src/color-picker/ColorPicker'
import {ControlType} from '../../template/domain/LayerTemplate'


function getControlTypeFromField(path: string) {
  if (path.endsWith('.encoding.icon.value')) {
    return ControlType.icon
  }
  if (path.endsWith('.encoding.color.value')) {
    return ControlType.staticColor
  }
  if (path.endsWith('.encoding.test') ||
    path.endsWith('.encoding.test.field') ||
    path.endsWith('.animation') ||
    path.endsWith('.encoding.arc.field') ||
    path.endsWith('.encoding.strokeSize.field') ||
    path.endsWith('.encoding.offset.x.field') ||
    path.endsWith('.encoding.offset.y.field') ||
    path.endsWith('.encoding.size.field') ||
    path.endsWith('.encoding.text.field') ||
    path.endsWith('.encoding.image.field') ||
    path.endsWith('.encoding.model.field') ||
    path.endsWith('.encoding.icon.field') ||
    path.endsWith('.encoding.color.field') ||
    path.endsWith('.encoding.strokeColor.field')) {
    return ControlType.field
  }
  return ControlType.unknown
}

interface Props {
  title: string
  fieldPath: string
  fieldControlType?: ControlType
  layer: Layer
  layers: Layers
  queries: Queries
  value: any
  onChange: (value: any) => void
}

export class TemplateFieldEditor extends PureComponent<Props> {
  render() {
    const {fieldPath} = this.props
    const controlType = this.props.fieldControlType ?? getControlTypeFromField(fieldPath)
    if (controlType === ControlType.field) {
      const fieldOptionsFn = getFieldOptionsFromPath(fieldPath)
      const fieldOptions = fieldOptionsFn && getFieldOptions({
        layer: this.props.layer,
        layers: this.props.layers,
        queries: this.props.queries,
      }, fieldOptionsFn).fieldOptions
      if (fieldOptionsFn) {
        return <FieldEditor
          layout="inline"
          title={this.props.title}
          options={fieldOptions}
          columns={this.props.queries.getColumns(this.props.layer.getQueryKey())}
          field={this.props.value}
          onChange={(value) => {
            this.props.onChange(value)
          }}
        />
      }
    }
    if (controlType === ControlType.icon) {
      return <PanelField
        layout="inline"
        title={this.props.title}
      >
        <IconSelect
          value={this.props.value}
          onChange={(value) => {
            this.props.onChange(value)
          }}
        />
      </PanelField>
    }
    if (controlType === ControlType.staticColor) {
      return <PanelField
        layout="inline"
        title={this.props.title}
      >
        <ColorPicker
          value={this.props.value}
          onChange={(value) => {
            this.props.onChange(value)
          }}
        />
      </PanelField>
    }
    return <div>{fieldPath}</div>
  }
}
