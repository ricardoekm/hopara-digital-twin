import {call, debounce, put, select, takeEvery} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import {Store} from '../state/Store'
import { PlaceSearchRepository } from './PlaceSearchRepository'
import ViewState, { Position } from '../view-state/ViewState'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { Logger } from '@hopara/internals'

export function* searchPlaces(action: ReturnType<typeof actions.navigation.searchRequested>) {
  try {
    const isGeo = yield select((store: Store) => store.visualizationStore.visualization?.isGeo())
    if (!action.payload.searchTerm || !isGeo) {
      return yield put(actions.place.search.success({places: []}))
    }

    const viewState: ViewState = yield select((store: Store) => store.viewState!)
    const authorization = yield getRefreshAuthorization()
    const language = yield select((store: Store) => store.browser.language)
    const suggestions = yield call(PlaceSearchRepository.searchPlaces, action.payload.searchTerm, viewState.getCoordinates(), language, authorization)
    yield put(actions.place.search.success({places: suggestions}))
  } catch (e) {
    Logger.error('Error searching places', e)
  }
}

export function* findPlace(action: ReturnType<typeof actions.navigation.placeClicked>) {
  const authorization = yield getRefreshAuthorization()
  const language = yield select((store: Store) => store.browser.language)
  const placeDetails = yield call(PlaceSearchRepository.getPlaceDetails, action.payload.place.id, language, authorization)
  const viewState: ViewState = yield select((store: Store) => store.viewState!)
  const zoom = viewState.getFitBoundsZoom(placeDetails.bounds)

  yield put(actions.navigation.goToPlace(new Position({
    y: placeDetails.latitude,
    x: placeDetails.longitude,
    zoom,
  })))
}

export const placeSagas = () => [
  debounce(300, actions.navigation.searchRequested, searchPlaces),
  takeEvery(actions.navigation.placeClicked, findPlace),
]
