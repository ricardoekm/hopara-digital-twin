import { isEmpty } from 'lodash'
import { Layer, PlainLayer } from '../Layer'
import { LayerTemplate, TemplateForm } from '../template/domain/LayerTemplate'
import { nullToUndefined } from './NullToUndefined'

export class TemplateCompiler {
  layerTemplates: LayerTemplate[]

  constructor(layerTemplates: LayerTemplate[]) {
    this.layerTemplates = layerTemplates
  }

  doCompile(plainLayer:PlainLayer, form:TemplateForm, formData:Record<string, any>, idMap:Record<string, string>, parentId: string) {
    let templateDataStr = JSON.stringify(plainLayer)
    form.forEach((formField) => {
      const formKey = formField.path
      const value = formData[formKey] ?? formField.defaultValue
      if (value) {
        templateDataStr = templateDataStr.replaceAll(`{{${formKey}}}`, value)
      } else {
        templateDataStr = templateDataStr.replaceAll(`"{{${formKey}}}"`, 'null')
      }      
    })

    Object.keys(idMap).forEach((key) => {
      templateDataStr = templateDataStr.replaceAll(key, idMap[key])
    })

    return nullToUndefined({...JSON.parse(templateDataStr), parentId})
  }

  getIdMap(layerCount: number): Record<string, string> {
    const idMap: Record<string, string> = {}
    for (let i = 0; i < layerCount; i++) {
      idMap[`{{id#${i}}}`] = crypto.randomUUID()
    }
    return idMap
  }

  compile(layer:Layer) {
    if (layer.template?.id && !isEmpty(this.layerTemplates)) {
      const template = this.layerTemplates.find((template) => template.id === layer.template!.id)
      if (template) {
        const formData = layer.template ?? {}
        const idMap = this.getIdMap(template.layers.length)
        return template.layers.map((plainLayer) => this.doCompile(plainLayer, template.form, formData, 
                                                                  idMap, layer.getId()))
      }
    } 

    return []
  }
}
