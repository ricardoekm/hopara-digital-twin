import {VisualizationService, VisualizationServiceResponse} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  id: string
}

export const deleteVisualizationRoute: RouteFactory<InputSchema, VisualizationServiceResponse, VisualizationService> = () => ({
  path: '/visualization/:id',
  scope: 'app:write',
  verb: routeVerb.delete,
  authenticated: true,
  handler: ({params, userInfo, container}) => {
    return container.resolve<VisualizationService>('visualizationService').delete(params.id, userInfo)
  },
})
