import {NotFoundError, RouteFactory, routeVerb} from '@hopara/http-server'
import {ResourceService} from '../ResourceService'

interface RouteInput {
  id: string
  preferenceId: string
  filterValueLimit?: number
  version?: number
}

export const listIconLibrariesRoute: RouteFactory<RouteInput, any> = () => ({
  path: '/icon-library',
  verb: routeVerb.get,
  handler: async ({container, headers}) => {
    const service = await container.resolve<ResourceService>('resourceService')
    const resp = service.listIconLibraries({
      tenant: headers.tenant,
      token: headers.authorization,
    })
    if (!resp) throw new NotFoundError('Visualization not found')
    return resp
  },
})
