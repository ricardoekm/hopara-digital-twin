import {LayerTemplate, LayerTemplateRepository} from './layer-template-repository.js'
import {inferFieldsFromLayers} from './infer-fields-from-layers.js'
import { alertingIcon } from './layer-templates/alerting-icon.js'
import { alertingIconAlternative } from './layer-templates/alerting-icon-alternative.js'
import { alertingIconWithText } from './layer-templates/alerting-icon-with-text.js'
import { alertingDot } from './layer-templates/alerting-dot.js'
import { iconWithBackground } from './layer-templates/icon-with-background.js'
import { iconWithBadge } from './layer-templates/icon-with-badge.js'
import { alertingText } from './layer-templates/alerting-text.js'
import { textBox } from './layer-templates/text-box.js'

export const layerTemplates: LayerTemplate[] = [
  alertingIcon as any,
  alertingIconAlternative,
  alertingIconWithText,
  alertingDot,
  alertingText,
  iconWithBackground,
  iconWithBadge,
  textBox,
]

export class MemoryLayerTemplateRepository implements LayerTemplateRepository {
  async list(): Promise<LayerTemplate[]> {
    return layerTemplates.map((template) => {
      const inferredFields = inferFieldsFromLayers(template.layers)
      inferredFields.forEach((field) => {
        if (template.form.some((form) => form.path === field)) return
        template.form.push({path: field})
      })
      return template
    })
  }
}
