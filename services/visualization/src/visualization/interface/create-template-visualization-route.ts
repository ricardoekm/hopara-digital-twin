import {RouteFactory, routeVerb} from '@hopara/http-server'
import { TemplateVisualizationService } from '../service/template-visualization-service.js'
import { VisualizationServiceResponse } from '../service/visualization-service.js'

interface InputSchema {
  id?: string
  name?: string
  templateId: string
}

export const createTemplateVisualizationRoute: RouteFactory<InputSchema, VisualizationServiceResponse[]|undefined> = () => ({
  path: '/template-visualization/:templateId',
  scope: 'app:write',
  verb: routeVerb.post,
  authenticated: true,
  handler: async ({params, container, userInfo}) => {
    return await container.resolve<TemplateVisualizationService>('templateVisualizationService').create(
      params.templateId,
      {id: params.id, name: params.name},
      userInfo,
    )
  },
})
