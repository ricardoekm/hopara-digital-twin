import {put, select, takeEvery} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import ls from 'localstorage-slim'
import { Store } from '../state/Store'
import { HelperItems } from './LayerHelperStore'
import { takeOnce } from '@hopara/state'

const STORAGE_KEY = 'hopara-layerHelpers'

export function* init() {
  const persistedState = ls.get(STORAGE_KEY) || {}
  const state = Object.keys(persistedState).length <= 500 ? persistedState : {}
  yield put(actions.layerHelper.initialized(state))
}

export function* persistState() {
  const items: HelperItems = yield select((store: Store) => store.layerHelper.items)
  if (Object.keys(items).length === 0) return
  ls.set(STORAGE_KEY, items)
}

export const layerHelperSagas = () => [
  takeOnce(actions.visualization.fetch.success, init),
  takeEvery(actions.layerHelper.onHelperDismissed, persistState),
  takeEvery(actions.layerHelper.onHelperLoaded, persistState),
  takeEvery(actions.settings.pageLoaded, persistState),
  takeEvery(actions.layerEditor.pageLoaded, persistState),
]
