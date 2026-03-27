import {RouteFactory, routeVerb} from '@hopara/http-server'
import {LayerTemplateService} from '../service/layer-template-service.js'
import {LayerTemplate} from '../layer-template-repository.js'

interface InputSchema {
  id: string,
  form: Record<string, any>
}

export const listLayerTemplatesRoute: RouteFactory<InputSchema, LayerTemplate[], LayerTemplateService> = (layerTemplateService) => ({
  path: '/layer-template',
  verb: routeVerb.get,
  authenticated: false,
  handler: async () => {
    return layerTemplateService.list()
  },
})
