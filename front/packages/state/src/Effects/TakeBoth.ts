import {take, all, fork} from '@redux-saga/core/effects'
import { ActionPattern, ActionWorker } from './Effects'

export function* takeBoth<P extends ActionPattern, PB extends ActionPattern>(patternA: P, patternB: PB, worker: ActionWorker<P>) {
  while (true) {
    const [actionA] = yield all([
      take(patternA),
      take(patternB),
    ])
  
    yield fork(worker, actionA)
  }
}
