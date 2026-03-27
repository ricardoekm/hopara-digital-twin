import {createAction} from 'typesafe-actions'

export const layerTemplateActions = {
  typeChanged: createAction('TYPE_CHANGED')<{ layerId: string, templateId: string }>(),
  configChanged: createAction('CONFIG_CHANGED')<{ layerId: string, templateId: string, fieldPath: string, value: any }>(),
}
