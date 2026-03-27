import {RouteFactory, routeVerb} from '@hopara/http-server'
import {NotFoundError} from '@hopara/http-server'
import { QueryService } from '../../query/QueryService'
import { Query } from '../../query/Query'

interface RouteInput {
  id: string
  queryId: string
}

export const getQueryRoute: RouteFactory<RouteInput, Query, QueryService> = (queryService) => ({
  path: '/template/:id/query/:queryId',
  verb: routeVerb.get,
  handler: async ({params}) => {
    const query = await queryService.get(params.id, params.queryId)
    if (!query) throw new NotFoundError('query not found')
    return query
  },
})

