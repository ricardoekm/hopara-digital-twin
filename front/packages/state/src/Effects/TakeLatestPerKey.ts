import {call, cancel, fork, take} from '@redux-saga/core/effects'
import { ActionKeySelector, ActionPattern, ActionWorker } from './Effects'

// From https://github.com/redux-saga/redux-saga/issues/1751
export function takeLatestPerKey<P extends ActionPattern>(patternOrChannel: P, worker: ActionWorker<P>, keySelector: ActionKeySelector<P>, ...args) {
  return fork(function* () {
    const tasks = {}

    while (true) {
      const action = yield take(patternOrChannel)
      const key = yield call(keySelector, action)

      if (tasks[key]) {
        yield cancel(tasks[key])
      }

      tasks[key] = yield fork<any>(worker, ...args, action)
    }
  })
}

