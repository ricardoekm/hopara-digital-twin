import {take, fork} from '@redux-saga/core/effects'
import { ActionPattern, ActionWorker } from './Effects'

export function* takeAfter<P extends ActionPattern>(count: number, patternOrChannel: P, worker: ActionWorker<P>) {
  while (true) {
    let action
    for (let i = 0; i < count; i++) {
      action = yield take(patternOrChannel)
    }
  
    yield fork(worker, action)
  }
}
