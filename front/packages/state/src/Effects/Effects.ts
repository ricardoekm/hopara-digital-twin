import {call, take} from '@redux-saga/core/effects'
import {ActionPattern as SagaActionPattern, ActionMatchingPattern, Channel} from '@redux-saga/types'

export type ActionPattern = SagaActionPattern
export type ActionWorker<P extends ActionPattern> = (action: ActionMatchingPattern<P>) => any
export type ActionKeySelector<P extends ActionPattern> = (action: ActionMatchingPattern<P>) => any
export type ActionPayloadSelector<P extends ActionPattern> = (action: ActionMatchingPattern<P>) => any

export function* handleForkedAction<P extends ActionPattern>(worker: ActionWorker<P>, channel: Channel<P>, callback?: () => void) {
  while (true) {
    const action = yield take(channel)
    yield call(worker, action)
    if (callback) {
      callback()
    }    
  }
}
