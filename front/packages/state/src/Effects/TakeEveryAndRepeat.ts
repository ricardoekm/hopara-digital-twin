import {take, fork, delay, race, cancel} from '@redux-saga/core/effects'
import { ActionPattern as AP, ActionWorker } from './Effects'


export function* takeEveryAndRepeat<P extends AP, CP extends AP>(patternOrChannel: P, interval: number, worker: ActionWorker<P>, cancelPatterns: CP[]) {
  let loop
  while (true) {
    const action = yield take(patternOrChannel)
    if (loop) return

    loop = yield fork(function* () {
      while (true) {
        yield fork(worker, action)
        yield delay(interval)
      }
    })
    
    yield race(cancelPatterns.map(((cancelPattern) => take(cancelPattern))))
    yield cancel(loop)
    loop = undefined
  }
}
