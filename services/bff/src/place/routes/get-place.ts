import { PlaceDetail, PlaceService } from '../place-service'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  id: string
  lang?: string
}

export const getPlaceRoute: RouteFactory<InputSchema, PlaceDetail, PlaceService> = () => ({
  path: '/place/:id',
  verb: routeVerb.get,
  authenticated: true,
  handler: ({params, container}) => {
    return container.resolve<PlaceService>('placeService').getPlace(params.id, params.lang)
  },
})
