import {RouteFactory, routeVerb, NotFoundError} from '@hopara/http-server'
import { VisualizationService } from '../../visualization/VisualizationService'

interface RouteInput {
  id: string
}

export const getVisualizationRoute: RouteFactory<RouteInput, any, VisualizationService> = (visualizationService) => ({
  path: '/template/:id/visualization',
  verb: routeVerb.get,
  handler: async ({params}) => {
    const visualization = await visualizationService.getVisualization(params.id)
    if (!visualization) throw new NotFoundError('visualization not found')
    return visualization
  },
})

