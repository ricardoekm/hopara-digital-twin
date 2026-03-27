import {RouteFactory, routeVerb} from '@hopara/http-server'
import {TemplateService} from '../../template/TemplateService'

interface RouteInput {
  templateId: string
  visualizationName: string
  visualizationId: string
  recreate?: boolean
}

export const saveVisualizationRoute: RouteFactory<RouteInput, any, any> = () => ({
  path: '/visualization',
  verb: routeVerb.post,
  handler: async ({params, container, headers}) => {
    const createdVisualizations = await container.resolve<TemplateService>('templateService').apply(
      params.templateId,
      params.visualizationName,
      params.visualizationId,
      {
        tenant: headers.tenant,
        token: headers.authorization,
      }
    )
    return createdVisualizations[0]
  },
})

