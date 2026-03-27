import {VisualizationService, VisualizationServiceResponse} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  id: string
  name: string
}

export const duplicateVisualizationRoute: RouteFactory<InputSchema, VisualizationServiceResponse> = () => ({
  path: '/visualization/:id/duplicate',
  scope: 'app:write',
  verb: routeVerb.post,
  authenticated: true,
  handler: ({params, container, userInfo}) => {
    return container.resolve<VisualizationService>('visualizationService').duplicate(
      params.id,
      params.name,
      userInfo,
    )
  },
})
