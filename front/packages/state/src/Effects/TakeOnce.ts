import {take, fork} from '@redux-saga/core/effects'
import {ActionPattern, ActionWorker} from './Effects'

export function* takeOnce<P extends ActionPattern>(patternOrChannel: P, worker: ActionWorker<P>) {
    const action = yield take(patternOrChannel)
    yield fork(worker, action)
}
