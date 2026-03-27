import {VisualizationService} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import {FilterSpec} from '../../filter/domain/spec/Filter.js'

interface InputSchema {
  id: string,
}

export const getVisualizationFiltersRoute: RouteFactory<InputSchema, FilterSpec[] | undefined> = () => ({
  path: '/visualization/:id/filters',
  verb: routeVerb.get,
  authenticated: true,
  handler: async ({params, container, userInfo}) => {
    const visualizationService = container.resolve<VisualizationService>('visualizationService')
    return await visualizationService.getFilters(params.id, userInfo)
  },
})

