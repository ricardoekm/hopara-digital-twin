import { Effect } from '@redux-saga/core/effects'

export const restartEffectMiddleware = (callback) => (next: any) => (effect: Effect) => {
  if (effect?.payload?.action?.type === 'RESTART') {
    callback()
    return next(effect.payload.action.effect)
  }

  return next(effect)
}
