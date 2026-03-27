import actions from '../../../state/Actions'
import {call, put, select, takeLatest} from '@redux-saga/core/effects'
import {listVisualizationHistory} from '../../VisualizationRepository'
import {Authorization} from '@hopara/authorization'
import {VisualizationHistory} from '../domain/VisualizationHistory'
import {getRefreshAuthorization} from '../../../auth/AuthSaga'
import {Store} from '../../../state/Store'

function* listHistory() {
  const visualizationId = yield select((store: Store) => store.visualizationStore.visualization.id)
  const authorization: Authorization = yield getRefreshAuthorization()
  const history = yield call(listVisualizationHistory, visualizationId, authorization)
  yield put(actions.visualizationHistory.list.success({history: new VisualizationHistory(...history)}))
}

export const historySagas = () => [
  takeLatest(actions.visualizationHistory.open, listHistory),
  takeLatest(actions.visualizationHistory.list.request, listHistory),
]
