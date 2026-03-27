import { PlainLayer } from '../../Layer'
import { LayerType } from '../../LayerType'

export enum ControlType {
  field = 'field',
  icon = 'icon',
  staticColor = 'static-color',
  unknown = 'unknown',
}

export type TemplateFormItem = {
  path: string
  defaultValue?: string
  controlType?: ControlType
}

export class TemplateForm extends Array<TemplateFormItem> {
}

export interface LayerTemplate {
  id: string,
  name: string,
  image: string,
  form: TemplateForm,
  layers: PlainLayer[]
}

export class LayerTemplates extends Array<LayerTemplate> {
  filterAllowed(allowedLayerTypes: LayerType[]): LayerTemplate[] {
    return this.filter((template) =>
      template.layers.every((layer) =>
        allowedLayerTypes.includes(layer.type!)
      )
    )
  }
}

export interface LayerTemplateConfig extends Record<string, any> {
}
