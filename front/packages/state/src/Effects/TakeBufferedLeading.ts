import {call, cancel, fork, take, put, race} from '@redux-saga/core/effects'
import {channel} from 'redux-saga'
import {buffers} from 'redux-saga'
import {isEqual} from 'lodash/fp'
import { ActionKeySelector, ActionPattern, ActionWorker, handleForkedAction } from './Effects'

// waits the execution of a saga then take the latest available discarding the rest
export function takeBufferedLeading<P extends ActionPattern>(
  pattern: P,
  worker: ActionWorker<P>,
) {
  return fork(function* () {
    let actionChannel = undefined as any
    while (true) {
      const action = yield take(pattern)

      if (!actionChannel) {
        actionChannel = yield call(channel, buffers.sliding(1))
        yield fork(handleForkedAction, worker, actionChannel)
      }

      yield put(actionChannel, action)
    }
  })
}

// waits the execution of a saga then take the latest available discarding the rest (per key)
export function takeBufferedLeadingPerKey<P extends ActionPattern>(
  pattern: P,
  worker: ActionWorker<P>,
  keySelector: ActionKeySelector<P>,
) {
  return fork(function* () {
    const channels = {}
    while (true) {
      const action = yield take(pattern)
      const key = yield call(keySelector, action)

      if (!channels[key]) {
        channels[key] = yield call(channel, buffers.sliding(1))
        yield fork(handleForkedAction, worker, channels[key])
      }

      yield put(channels[key], action)
    }
  })
}

// waits the execution of a saga then take the latest available discarding the rest (per key)
// if cancel pattern is triggered cancel the current affect
export function takeBufferedLeadingPerKeyWithCancel<P extends ActionPattern, CP extends ActionPattern>(
  pattern: P,
  worker: ActionWorker<P>,
  keySelector: ActionKeySelector<P>,
  cancelPattern: CP,
  payloadSelector: ActionKeySelector<P>,
) {
  return fork(function* () {
    const channels = {}
    const tasks = {}
    const payloads = {}

    while (true) {
      const {action, cancelAction} = yield race({
        action: take(pattern),
        cancelAction: take(cancelPattern),
      })

      if (action) {
        const key = yield call(keySelector, action)
        if (!channels[key]) {
          channels[key] = yield call(channel, buffers.sliding(1))
          // Starts listening channel
          tasks[key] = yield fork(handleForkedAction, worker, channels[key], () => {
            payloads[key] = undefined
          })
        }
        
        if (payloadSelector) {
          const currentPayload = yield call(payloadSelector, action)
          // We won`t queue the same action twice
          if (payloads[key] && isEqual(payloads[key], currentPayload)) {
            continue
          }

          payloads[key] = currentPayload
        }

        yield put(channels[key], action)
      }

      if (cancelAction) {
        const key = yield call(keySelector, cancelAction)
        if (tasks[key]) {
          yield cancel(tasks[key])
          // Starts listening channel again
          payloads[key] = undefined
          tasks[key] = yield fork(handleForkedAction, worker, channels[key], () => {
            payloads[key] = undefined
          })
        }
      }
    }
  })
}
