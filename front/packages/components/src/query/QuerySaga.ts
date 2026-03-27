import {Authorization} from '@hopara/authorization'
import {call, put, select} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import {getQueries} from './QueryRepository'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { Store } from '../state/Store'
import { Queries } from '@hopara/dataset'
import { takeBufferedLeading } from '@hopara/state'

export function* fetchQueries() {
  try {
    const authorization: Authorization = yield getRefreshAuthorization()
    const queries = yield call(getQueries, authorization)
    yield put(actions.query.fetch.success({queries}))
  } catch (e: any) {
    yield put(actions.query.fetch.failure({exception: e}))
  }
}

export function* mergeQueries(action: ReturnType<typeof actions.rowset.fetch.success>) {
  const columns = action.payload.rowset.rows.columns
  if (!columns) return

  const queries: Queries = yield select((state: Store) => state.queryStore.queries)
  const query = queries.findQuery(action.payload.rowset.data.getQueryKey())
  if (!query) return

  const newQuery = query.clone()
  newQuery.columns = query.columns.mergeWithKeepingOlds(columns)
  if (newQuery.columns.isSame(query.columns)) return
  yield put(actions.query.mergedWithRowset({query: newQuery}))
}

export const querySagas = () => [
  takeBufferedLeading(actions.settings.pageLoaded, fetchQueries),
  takeBufferedLeading(actions.layerEditor.pageLoaded, fetchQueries),
  takeBufferedLeading(actions.query.changed, fetchQueries),
  takeBufferedLeading(actions.rowset.fetch.success, mergeQueries),
  takeBufferedLeading(actions.query.fetch.request, fetchQueries),
]
