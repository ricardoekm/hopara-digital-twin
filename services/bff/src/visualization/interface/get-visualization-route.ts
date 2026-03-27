import {VisualizationService} from '../VisualizationService'
import {NotFoundError, RouteFactory, routeVerb, Response} from '@hopara/http-server'

interface RouteInput {
  id: string
  preferenceId: string
  version?: number
  fallbackVisualization?: string
  term: string
}

export const getVisualizationRoute: RouteFactory<RouteInput, any> = () => ({
  path: '/visualization/:id',
  verb: routeVerb.get,
  handler: async ({params, container, headers}) => {
    const resp = await container.resolve<VisualizationService>('visualizationService').get(
      params.id,
      params.version as number,
      params.fallbackVisualization,
      {
        tenant: headers.tenant,
        token: headers.authorization,
      }
    )
    if (!resp) throw new NotFoundError('Visualization not found')
    return new Response(resp, undefined, {
      'Tenant': headers.tenant,
    })
  },
})
