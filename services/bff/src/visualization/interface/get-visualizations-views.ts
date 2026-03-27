import {VisualizationService} from '../VisualizationService'
import {NotFoundError, RouteFactory, routeVerb} from '@hopara/http-server'

export const getVisualizationsQueryKeys: RouteFactory<void, any> = () => ({
  path: '/visualization-view',
  verb: routeVerb.get,
  handler: async ({container, headers}) => {
    const service = container.resolve<VisualizationService>('visualizationService')
    const resp = await service.getAllQueryKeys({
      tenant: headers.tenant,
      token: headers.authorization,
    })
    if (!resp) throw new NotFoundError('Visualization not found')
    return resp
  },
})
