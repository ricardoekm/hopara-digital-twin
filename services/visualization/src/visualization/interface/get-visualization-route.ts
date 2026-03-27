import {VisualizationService} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  id: string,
  version?: number
}

export const getVisualizationRoute: RouteFactory<InputSchema, Record<string, any>> = () => ({
  path: '/visualization/:id',
  verb: routeVerb.get,
  authenticated: true,
  handler: async ({params, container, userInfo}) => {
    const visualizationService = container.resolve<VisualizationService>('visualizationService')
    return await visualizationService.get(params.id, params.version, userInfo)
  },
})

