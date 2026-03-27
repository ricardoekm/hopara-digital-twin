import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import { ActiveEvent, ViewController } from './ViewController'
import { Reducer } from '@hopara/state'

export const viewControllerReducer: Reducer<ViewController | undefined, ActionTypes> = (state, action) => {
  switch (action.type) {
    case getType(actions.visualization.routeChanged):
      return
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.fetch.failure):
      return action.payload.viewController
    case getType(actions.navigation.bearingModeToggle):
      return state?.immutableToggleDragMode()
    case getType(actions.viewLayer.dragStarted):
    case getType(actions.view.viewDragStart):
      return state?.setActiveEvent(ActiveEvent.PAN)
    case getType(actions.viewLayer.dragEnded):
    case getType(actions.view.viewDragEnd):
      return state?.setActiveEvent(ActiveEvent.NONE)
    default:
      return state
  }
}
