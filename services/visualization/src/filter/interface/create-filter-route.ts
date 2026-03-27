import {RouteFactory, routeVerb} from '@hopara/http-server'
import {FilterService} from '../service/filter-service.js'
import Filter from '../domain/Filter.js'

export const createFilterRoute: RouteFactory<void, Filter> = () => ({
  path: '/filter',
  verb: routeVerb.post,
  authenticated: true,
  handler: async (): Promise<Filter> => {
    return FilterService.getFilterDraft()
  },
})
