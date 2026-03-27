import {VisualizationService} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  group?: string
}

export const getVisualizationsRoute: RouteFactory<InputSchema, any[]> = () => ({
  path: '/visualization',
  verb: routeVerb.get,
  authenticated: true,
  scope: 'app:list',
  handler: ({params, container, userInfo}) => {
    return container.resolve<VisualizationService>('visualizationService').list(params.group, userInfo)
  },
})
