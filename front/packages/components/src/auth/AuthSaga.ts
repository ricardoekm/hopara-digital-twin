import { call, put, select } from '@redux-saga/core/effects'
import { Store } from '../state/Store'
import { Authorization } from '@hopara/authorization'
import { getRefreshedAuthorization as refreshAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'
import actions from '../state/Actions'

export function* getRefreshAuthorization() {
  try {
    const authorization: Authorization = yield select((store: Store) => store.auth.authorization)
    const refreshedAuthorization = yield call(refreshAuthorization, authorization)

    if (refreshedAuthorization.accessToken !== authorization.accessToken) {
      yield put(actions.auth.refreshed({authorization: refreshedAuthorization}))
    }

    return refreshedAuthorization
  } catch {
    yield put(actions.auth.refreshed({authorization: Authorization.createEmpty()}))
    return Authorization.createEmpty()
  }
}
