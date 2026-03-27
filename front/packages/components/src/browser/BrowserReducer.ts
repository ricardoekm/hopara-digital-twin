import { Reducer } from '@hopara/state'
import { BrowserStore } from './BrowserStore'
import actions, { ActionTypes } from '../state/Actions'
import { Store } from '../state/Store'
import { getType } from 'typesafe-actions'

export const browserReducer: Reducer<BrowserStore, ActionTypes> = (state: BrowserStore | undefined, action: ActionTypes, globalState: Store): BrowserStore => {
  if (!state && !!globalState?.browser) {
    return globalState.browser
  } else if (!state) {
    return new BrowserStore()
  }

  switch (action.type) {
    case getType(actions.browser.init):
      return new BrowserStore(action.payload.platform, action.payload.webgl, action.payload.device, state.language)
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
    case getType(actions.hoc.languageChanged):
      if (!action.payload.language) return state
      return state.setLanguage(action.payload.language)
    default:
      return state
  }
}
