import { call, put, race, take, takeLeading } from '@redux-saga/core/effects'
import actions from '../state/Actions'
import { getUserLocation, watchUserLocation as doWatchUserLocation} from './UserLocation'
import { eventChannel } from 'redux-saga'
import { Coordinates } from '@hopara/spatial'

export function* showUserLocation() {
  try {
    const location = yield getUserLocation()
    yield put(actions.userLocation.show.success({
      coordinates: location.coordinates,
      accuracy: location.accuracy,
    }))
  } catch (e: any) {
    yield put(actions.userLocation.show.failure({exception: e}))
  }
}

export function getWatchUserLocationChannel() {
  return eventChannel((emit) => {
    if (!navigator.geolocation) {
      return () => {/* ignore */}
    }

    const watchId = doWatchUserLocation((coordinates:Coordinates) => {
      emit(coordinates)
    })

    return () => navigator.geolocation.clearWatch(watchId)
  })
}

export function* watchUserLocation() {
  const channel = yield call(getWatchUserLocationChannel)
  
  try {
    while (true) {
      const {location, cancel} = yield race({
        location: take(channel),
        cancel: take(actions.userLocation.hide),
      })

      if (location) {
        yield put(actions.userLocation.refresh.success({
          coordinates: location.coordinates,
          accuracy: location.accuracy,
        }))
      } else if (cancel) {
        channel.close()
      }
    }
  } finally {
    channel.close()
  }
}

export const userLocationSagas = () => [
  takeLeading(actions.userLocation.show.request, showUserLocation),
  takeLeading(actions.userLocation.show.success, watchUserLocation),
]
