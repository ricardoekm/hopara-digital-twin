import actions, {ActionTypes} from '../../../state/Actions'
import {getType} from 'typesafe-actions'
import {MenuStore} from '../../../menu/MenuStore'
import {createObjectEditorMenu} from '../ObjectEditorMenu'
import {Reducer} from '@hopara/state'

export const objectMenuReducer: Reducer<MenuStore, ActionTypes> = (state = new MenuStore(), action, globalState): MenuStore => {
  switch (action.type) {
    case getType(actions.auth.signedIn):
      return state.setLoading(true)
    case getType(actions.visualization.routeChanged):
      return new MenuStore()
    case getType(actions.objectEditor.pageLoaded):
      return new MenuStore({selectedId: state.selectedId})
        .setItems(createObjectEditorMenu(globalState.layerStore.layers, globalState.queryStore.queries))
        .setLoading(state.loading)
    case getType(actions.visualization.fetch.success):
    case getType(actions.visualization.refreshed):
      return state
        .setItems(createObjectEditorMenu(action.payload.layers, action.payload.queries))
        .setLoading(false)
    case getType(actions.object.typeSelected):
      return state.selectItem(action.payload.id)
    case getType(actions.objectEditor.itemCloseClicked):
    case getType(actions.details.closeClicked):
      return state.unselectItem()
    default:
      return state
  }
}

