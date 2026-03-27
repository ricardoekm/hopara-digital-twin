import {call, debounce, put, select, takeLatest} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import { Store } from '../state/Store'
import { validateConfig } from './Validator'
import { toastError } from '@hopara/design-system/src/toast/Toast'
import { Logger } from '@hopara/internals'
import { Authorization } from '@hopara/authorization'
import { getRefreshedAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'
import { SelectedFilters } from '../filter/domain/SelectedFilters'
import { takeEveryAndRestart } from '@hopara/state'
import { InitialRowState } from '../initial-row/InitialRowReducer'


function* init(action: ReturnType<typeof actions.hoc.configLoaded>) {
  try {
    validateConfig(action.payload)
    const refreshedAuthorization = yield call(getRefreshedAuthorization, action.payload.authorization)
    yield put(actions.hoc.initRequested({ ...action.payload, authorization: refreshedAuthorization }))
  } catch (error: any) {
    yield put(actions.hoc.configWithError({...action.payload, e: error}))
  }
}

function* changeConfig(action: ReturnType<typeof actions.hoc.configUpdated>) {
  try {
    validateConfig(action.payload)

    const stateAuthorization: Authorization | undefined = yield select((store: Store) => store.auth.authorization)
    const isRefreshableToken = stateAuthorization?.refreshToken && stateAuthorization?.accessToken
    const isTokenChanged = !isRefreshableToken && stateAuthorization?.accessToken !== action.payload.authorization.accessToken
    const isRefreshChanged = stateAuthorization?.refreshToken !== action.payload.authorization.refreshToken
    const isLanguageChanged = yield select((store: Store) => store.browser.language !== action.payload.language)

    if (isLanguageChanged) {
      yield put(actions.hoc.languageChanged(action.payload))
    }

    if (isTokenChanged || isRefreshChanged) {
      yield put(actions.hoc.accessTokenChanged({authorization: action.payload.authorization}))
    }

    const dataLoadersChanged: boolean = yield select((store: Store) => !store.queryStore.isSameLoaders(action.payload.dataLoaders ?? []))
    if (dataLoadersChanged) {
      yield put(actions.hoc.loaderChanged({dataLoaders: action.payload.dataLoaders ?? []}))
    }

    const filtersChanged: boolean = yield select((store: Store) => !store.filterStore.isSameSelectedFilters(action.payload.filters ?? [] as any))
    if (filtersChanged) {
      yield put(actions.hoc.filterChanged({filters: action.payload.filters ?? new SelectedFilters()}))
    }

    const initialRowState: InitialRowState | undefined = yield select((store: Store) => store.initialRow)
    if (action.payload.initialRow && (initialRowState?.layerId !== action.payload.initialRow?.layerId || initialRowState?.rowId !== action.payload.initialRow?.rowId)) {
      yield put(actions.hoc.initialRowChanged({initialRow: action.payload.initialRow!}))
    }
  } catch (error: any) {
    yield put(actions.hoc.configWithError({...action.payload, e: error}))
  }
}

function* notifyError(action: ReturnType<typeof actions.hoc.configWithError>) {
  Logger.error(action.payload.e)
  yield toastError(action.payload.e.message)
}

function* initRequested(action: ReturnType<typeof actions.hoc.initRequested>) {
  yield put(actions.hoc.init(action.payload))
}

export const hocSagas = () => [
  debounce(300, actions.hoc.configLoaded, init),
  debounce(300, actions.hoc.configUpdated, changeConfig),
  takeLatest(actions.hoc.configWithError, notifyError),
  takeEveryAndRestart(actions.hoc.initRequested, initRequested),
]
