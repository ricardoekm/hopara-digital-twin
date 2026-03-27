import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import { Row } from '@hopara/dataset'
import { Reducer } from '@hopara/state'
import { Coordinates } from '@hopara/spatial'

export interface CallbackFunction {
  name: string
  callback: (row: Row, pixel?: Coordinates) => void
}

export interface ActionState {
  registeredCallbacks: CallbackFunction[]
}

export const actionReducer: Reducer<ActionState, ActionTypes> = (state, action, globalState) => {
  if (!state && globalState?.action) {
    return globalState.action
  } else if (!state) {
    return {registeredCallbacks: []}
  }

  switch (action.type) {
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
      return {registeredCallbacks: action.payload.callbacks ?? []}
    default:
      return state
  }
}
