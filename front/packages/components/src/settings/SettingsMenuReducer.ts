import actions, {ActionTypes} from '../state/Actions'
import {getType} from 'typesafe-actions'
import { MenuStore } from '../menu/MenuStore'
import { createSettingsMenu } from './SettingsMenu'
import { Reducer } from '@hopara/state'

export const settingsMenuReducer: Reducer<MenuStore, ActionTypes> = (state = new MenuStore(), action, globalState): MenuStore => {
  switch (action.type) {
    case getType(actions.visualization.routeChanged):
      return new MenuStore()
    case getType(actions.settings.pageLoaded):
      return new MenuStore()
        .setItems(createSettingsMenu(globalState.visualizationStore.visualization))
        .selectFirstItem()
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
      if (globalState.visualizationStore.isOnSettings()) {
        return state.setItems(createSettingsMenu(action.payload.visualization))
      }
      return state
    case getType(actions.settings.itemSelected):
        return state.selectItem(action.payload.id)
    default:
      return state
  }
}

