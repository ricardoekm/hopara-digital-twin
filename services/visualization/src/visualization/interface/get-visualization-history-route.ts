import {VisualizationService} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import {Visualization} from '../domain/Visualization.js'

interface InputSchema {
  id: string
}


export const getVisualizationHistoryRoute: RouteFactory<InputSchema, Visualization[]> = () => ({
  path: '/visualization/:id/history',
  verb: routeVerb.get,
  authenticated: true,
  handler: ({container, userInfo, params}) => {
    return container.resolve<VisualizationService>('visualizationService').listHistory(params.id, userInfo)
  },
})
