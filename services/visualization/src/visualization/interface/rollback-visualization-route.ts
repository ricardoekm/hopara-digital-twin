import {VisualizationService, VisualizationServiceResponse} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import {VisualizationSpec} from '../domain/spec/Visualization.js'

type InputSchema = VisualizationSpec & {
  id: string
  version: number
}

export const rollbackVisualizationRoute: RouteFactory<InputSchema, VisualizationServiceResponse> = () => ({
  path: '/visualization/:id/rollback',
  scope: 'app:write',
  verb: routeVerb.put,
  authenticated: true,
  handler: ({params, container, userInfo}) => {
    return container.resolve<VisualizationService>('visualizationService').rollback(
      params.id,
      params.version,
      userInfo,
    )
  },
})
