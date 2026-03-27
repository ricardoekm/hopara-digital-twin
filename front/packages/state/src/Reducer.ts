import {Action} from '@reduxjs/toolkit'

export function getInitialState(childReducers: any, state: any, action: any) {
  const reducedInitialState = {}
  for (const key in childReducers) {
    if ({}.hasOwnProperty.call(childReducers, key)) {
      reducedInitialState[key] = childReducers[key](undefined, action, state)
    }
  }
  return reducedInitialState
}

export function getChildrenState(childReducers: any, state: any, action: any) {
  const reducedState = {...state}
  for (const key in childReducers) {
    if ({}.hasOwnProperty.call(childReducers, key)) {
      reducedState[key] = childReducers[key](state[key], action, reducedState)
    }
  }
  return reducedState
}

export function reducer(childReducers:any) {
  return function(state: any, action: any): any {
    if (state == null || action.type === 'RESTART') {
      return getInitialState(childReducers, state, action)
    }
    return getChildrenState(childReducers, state, action)
  }
}

export type Reducer<S, A extends Action, GS = any> = (
  state: S | undefined,
  action: A,
  globalState: GS
) => S

