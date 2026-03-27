import {VisualizationService} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import {VisualizationSpec} from '../domain/spec/Visualization.js'


export const migrateVisualizationRoute: RouteFactory<VisualizationSpec, Record<string, any>> = () => ({
  path: '/migrate',
  verb: routeVerb.post,
  handler: async ({params, container}) => {
    const visualizationService = container.resolve<VisualizationService>('visualizationService')
    return await visualizationService.migrate(params)
  },
})

