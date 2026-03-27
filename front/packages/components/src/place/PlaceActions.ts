import { createAction, createAsyncAction } from 'typesafe-actions'
import { PlaceSuggenstion } from './PlaceSearchRepository'

export interface PlaceSearchPayload {
  places: PlaceSuggenstion[]
}

export const placeActions = {
  search: createAsyncAction(
    'PLACE_SEARCH_REQUEST',
    'PLACE_SEARCH_SUCCESS',
    'PLACE_SEARCH_FAILURE',
  )<void, PlaceSearchPayload, {exception: Error}>(),
  searchItemClicked: createAction('PLACE_SEARCH_ITEM_CLICKED')<{id: string}>(),
}
