import {NotFoundError, RouteFactory, routeVerb, Response} from '@hopara/http-server'
import { LayerService } from '../LayerService'

interface RouteInput {
  visualizationId: string
  layerId: string
}

export const getLayerDataRoute: RouteFactory<RouteInput, any> = () => ({
  path: '/layer-data',
  verb: routeVerb.get,
  handler: async ({params, container, headers}) => {
    const resp = await container.resolve<LayerService>('layerService').getLayerData(
      params.visualizationId,
      params.layerId,
      {
        tenant: headers.tenant,
        token: headers.authorization,
      }
    )
    if (!resp) throw new NotFoundError('Layer data not found')
    return new Response(resp, undefined, {
      'Tenant': headers.tenant,
    })
  },
})
