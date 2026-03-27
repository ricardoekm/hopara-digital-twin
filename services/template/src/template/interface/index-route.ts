import {RouteFactory, routeVerb} from '@hopara/http-server'
import { IndexService } from '../../index/IndexService'

interface RouteInput {
  id: string
  recreate?: boolean
}

export const indexRoute: RouteFactory<RouteInput, any, IndexService> = (indexService) => ({
  path: '/template/:id/index',
  verb: routeVerb.put,
  authenticated: true,
  handler: async ({params, userInfo}) => {
    await indexService.index(params.id, userInfo.tenant, userInfo.authorization!, params.recreate)
    return { success: true, message: `Template ${params.id} indexed successfully` }
  },
})

