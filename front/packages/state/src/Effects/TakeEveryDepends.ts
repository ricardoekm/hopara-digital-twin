import {take, all, fork} from '@redux-saga/core/effects'
import { ActionPattern, ActionWorker } from './Effects'

export function* takeEveryDepends<P extends ActionPattern, PR extends ActionPattern>(pattern: P, requiresPattern: PR, worker: ActionWorker<P>) {
  const [actionA] = yield all([
    take(pattern),
    take(requiresPattern),
  ])

  yield fork(worker, actionA)

  while (true) {
    const action = yield take(pattern)  
    yield fork(worker, action)
  }
}
