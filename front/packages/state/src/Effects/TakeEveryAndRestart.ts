import {take, put, fork} from '@redux-saga/core/effects'
import { ActionPattern, ActionWorker } from './Effects'

export function* takeEveryAndRestart<P extends ActionPattern>(patternOrChannel: P, worker: ActionWorker<P>) {
  while (true) {
    const action = yield take(patternOrChannel)
    yield put({
      type: 'RESTART',
      effect: fork(worker, action),
    })
  }
}
