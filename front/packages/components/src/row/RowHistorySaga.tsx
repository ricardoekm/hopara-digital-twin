import {put, select, takeEvery} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import {Store} from '../state/Store'
import { ResourceHistory, ResourceHistoryType, RowHistory } from './RowHistoryStore'

const isImageHistory = (history: RowHistory | ResourceHistory): history is ResourceHistory => {
  return 'version' in history && history.type === ResourceHistoryType.image
}

const isModelHistory = (history: RowHistory | ResourceHistory): history is ResourceHistory => {
  return 'version' in history && history.type === ResourceHistoryType.model
}

function* undo() {
  const lastHistory: RowHistory | ResourceHistory = yield select((store: Store) => store.rowHistory.last())
  if (!lastHistory) return

  if (isImageHistory(lastHistory)) {
    return yield put(actions.rowHistory.imageUndoRequested(lastHistory))
  } else if (isModelHistory(lastHistory)) {
    return yield put(actions.rowHistory.modelUndoRequested(lastHistory))
  }
  
  return yield put(actions.rowHistory.rowUndoRequested(lastHistory))
}

export const rowHistorySagas = () => [
  takeEvery(actions.object.undoRequest, undo),
]
