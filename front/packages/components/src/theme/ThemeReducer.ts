import { userPrefersDarkMode } from '@hopara/design-system/src/theme/Theme'
import actions, {ActionTypes} from '../state/Actions'
import {getType} from 'typesafe-actions'
import { Reducer } from '@hopara/state'

interface ThemeState {
  mode: 'light' | 'dark'
}

const initialState: ThemeState = {
  mode: userPrefersDarkMode() ? 'dark' : 'light',
}

export const themeReducer: Reducer<ThemeState, ActionTypes> = (state, action, globalState) => {
  if (!state && globalState?.theme) {
    return globalState.theme
  } else if (!state) {
    return initialState
  }

  switch (action.type) {
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
      return {
        ...state,
        mode: action.payload.darkMode ? 'dark' : 'light',
      }
    default:
      return state
  }
}
