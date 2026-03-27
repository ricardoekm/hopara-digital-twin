// Centralized application state, updated by the reducers.
import 'reflect-metadata'
import {configureStore, Middleware} from '@reduxjs/toolkit'
import createSagaMiddleware, {Task} from '@redux-saga/core'
import {Debug} from '@hopara/internals'

import {NotificationListener} from '../notification/NotificationListener'
import {reducer} from '@hopara/state'
import {rootSaga} from './Saga'
import {restartEffectMiddleware} from '@hopara/state'
import {childReducers} from './ChildReducers'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: () => Middleware<any>;
  }
}

let middleware: Task

function getStore(): any {
  let store: any = undefined

  const sagaMiddleware = createSagaMiddleware({effectMiddlewares: [restartEffectMiddleware(() => {
    middleware.cancel()
    middleware = sagaMiddleware.run(rootSaga)
    if (store) {
      store.dispatch({type: 'RESTART'})
    }
  })]})

  store = configureStore({
    reducer: reducer(childReducers),
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(sagaMiddleware)
      if (Debug.isDebugging() && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        middleware.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())
      }
      return middleware
    },
  })

  middleware = sagaMiddleware.run(rootSaga)

  NotificationListener.configure(store.dispatch)

  return store
}

export default getStore

export type Store = {[key in keyof typeof childReducers]: ReturnType<typeof childReducers[key]>}

