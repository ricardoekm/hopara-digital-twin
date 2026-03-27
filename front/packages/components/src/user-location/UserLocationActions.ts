import { Coordinates } from '@hopara/spatial'
import {createAction, createAsyncAction} from 'typesafe-actions'

interface UserLocationPayload {
  coordinates: Coordinates
  accuracy: number
}

export const userLocationActions = {
  show: createAsyncAction(
    'SHOW_USER_LOCATION_REQUESTED',
    'SHOW_USER_LOCATION_SUCCESS',
    'SHOW_USER_LOCATION_FAILURE',
  )<void, UserLocationPayload, { exception: Error }>(),
  refresh: createAsyncAction(
    'REFRESH_USER_LOCATION_REQUESTED',
    'REFRESH_USER_LOCATION_SUCCESS',
    'REFRESH_USER_LOCATION_FAILURE',
  )<void, UserLocationPayload, { exception: Error }>(),
  hide: createAction('HIDE_USER_LOCATION')(),
}
