import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../../../state/Actions'
import { Reducer } from '@hopara/state'
import { Config } from '@hopara/config'
import { Internals } from '@hopara/internals'

class NavigationStore {
  visible?: boolean
  visibilityLocked?: boolean
  search: {
    term?: string
    open?: boolean
  }

  constructor(props?: Partial<NavigationStore>) {
    Object.assign(this, props)
    if (!this.search) this.search = {}
  }

  setVisibility(visible: boolean) {
    if (this.visibilityLocked) return this
    return new NavigationStore({...this, visible})
  }

  setSearchTerm(term?: string) {
    return new NavigationStore({...this, search: {...this.search, term}})
  }

  setSearchOpen(open: boolean) {
    return new NavigationStore({...this, search: {...this.search, open}})
  }
}

const isTouchDevice = () => {
  return Config.getValueAsBoolean('IS_TOUCH_DEVICE') && !Config.getValueAsBoolean('IS_HEADLESS_DEVICE')
}

export const navigationReducer: Reducer<NavigationStore, ActionTypes> = (state: NavigationStore | undefined, action) => {
  if (!state) {
    return new NavigationStore({
      visible: Internals.getParam('navigationControls') !== false || isTouchDevice(),
    })
  }

  switch (action.type) {
    case getType(actions.hoc.init):
    case getType(actions.hoc.configUpdated): {
      if (action.payload.navigationControls !== false) return state
      return new NavigationStore({...state, visible: false, visibilityLocked: true})
    }
    case getType(actions.navigation.hide):
      if (state.search.open) return state
      return state.setVisibility(false)
    case getType(actions.navigation.show):
    case getType(actions.objectEditor.pageLoaded):
    case getType(actions.settings.pageLoaded):
    case getType(actions.layerEditor.pageLoaded): {
      return state.setVisibility(true)
    }
    case getType(actions.objectList.fetch.request):
      return state.setSearchTerm(action.payload.searchTerm)
    case getType(actions.navigation.onSearchOpen):
      return state.setSearchOpen(true)
    case getType(actions.navigation.onSearchCloseClicked):
    case getType(actions.navigation.onSearchClose):
      return state.setSearchOpen(false)
    default:
      return state
  }
}

