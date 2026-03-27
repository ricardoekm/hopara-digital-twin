import {take, fork, race} from '@redux-saga/core/effects'
import {ActionPattern, ActionWorker} from './Effects'

export function* takeAnyOnce<P extends ActionPattern>(patternOrChannel: P[], worker: ActionWorker<P>) {
    const action = yield race(patternOrChannel.map(((cancelPattern) => take(cancelPattern))))
    yield fork(worker, action)
}
