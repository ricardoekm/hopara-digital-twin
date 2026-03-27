import { PlaceService, PlaceSuggestionResponse } from '../place-service'
import {RouteFactory, routeVerb} from '@hopara/http-server'

interface InputSchema {
  query: string
  location?: [number, number]
  lang?: string
}

export const getSuggestionsRoute: RouteFactory<InputSchema, PlaceSuggestionResponse, PlaceService> = () => ({
  path: '/places',
  verb: routeVerb.get,
  authenticated: true,
  handler: ({params, container}) => {
    return container.resolve<PlaceService>('placeService').getSuggestions(params.query, params.location, params.lang)
  },
})
