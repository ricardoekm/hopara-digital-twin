import {Authorization} from '@hopara/authorization'
import {listTemplates} from './LayerTemplateRepository'
import {LayerTemplate} from './domain/LayerTemplate'

export const list = async (
  authorization: Authorization,
): Promise<LayerTemplate[]> => {
  return listTemplates(authorization)
}

