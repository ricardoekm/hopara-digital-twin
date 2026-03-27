import {take, fork, race, cancel, call} from '@redux-saga/core/effects'
import { ActionPattern as AP, ActionWorker } from './Effects'

export function* takeEveryAndLoop<P extends AP, CP extends AP>(pattern: P, worker: ActionWorker<P>, cancelPatterns: CP[]) {  
  while (true) {
     const action = yield take(pattern)
     const loop = yield fork(function* () {
      while (true) {
        yield call(worker, action)
      }
     })

     yield race(cancelPatterns.map(((cancelPattern) => take(cancelPattern))))
     yield cancel(loop)
  }
}
