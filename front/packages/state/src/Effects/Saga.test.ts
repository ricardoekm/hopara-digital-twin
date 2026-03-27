import createSagaMiddleware, { Task, runSaga as reduxRunSaga } from '@redux-saga/core'
import { all, Effect } from '@redux-saga/core/effects'
import { configureStore } from '@reduxjs/toolkit'
import {restartEffectMiddleware} from './index'

export class SagaTest {
  task: Task<any>
  middleware: any
  expectedPattern = ''
  responses: any[] = []
  store: any
  effects: any

  constructor(testEffects, expectedPattern) {
    this.createTask(testEffects)
    this.expectedPattern = expectedPattern
  }

  private createTask(testEffects) {
    function rootReducer(_, action) {
      return action
    }

    this.middleware = createSagaMiddleware({ effectMiddlewares: [this.effectMiddleware.bind(this), restartEffectMiddleware(() => {
      const effects = this.effects
      function* root() {
        yield all(effects())
      }
      this.task.cancel()
      this.task = this.middleware.run(root)
    })] })

    this.store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(this.middleware)
      },
    })

    this.effects = testEffects

    function* root() {
      yield all(testEffects())
    }

    this.task = this.middleware.run(root)
  }

  private effectMiddleware(next) {
    return (effect: Effect) => {
      if (effect.payload?.action?.type === this.expectedPattern) {
        this.responses.push(effect.payload.action.payload)
      }

      return next(effect)
    }
  }

  end() {
    return this.task.cancel()
  }

  dispatch(action) {
    return this.store.dispatch(action)
  }

  clearResponses() {
    this.responses = []
  }
}

export async function runSaga<MS>(mockStore: MS, sagaFunction, ...parameters: any[]) {
  const dispatched: any[] = []

  await reduxRunSaga<void, MS, any>(
    {
      dispatch: (action) => (dispatched.push(action)),
      getState: () => (mockStore),
    },
    sagaFunction,
    ...parameters,
  )

  return dispatched
}

test('SagaTest', async () => {
  expect(true).toBeTruthy()
})
