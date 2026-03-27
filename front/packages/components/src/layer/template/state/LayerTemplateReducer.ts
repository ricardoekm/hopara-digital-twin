import {getType} from 'typesafe-actions'
import actions, {ActionTypes} from '../../../state/Actions'
import {LayerTemplates} from '../domain/LayerTemplate'
import {Reducer} from '@hopara/state'
import { LayerTemplateStore } from './LayerTemplateStore'
import { isEmpty } from 'lodash'

export const layerTemplateReducer: Reducer<LayerTemplateStore, ActionTypes> = (state = new LayerTemplateStore(), action) => {
  switch (action.type) {
    case getType(actions.visualization.fetch.request):
      return state.immutableSetLoading(true)
    case getType(actions.visualization.fetch.success):
      if ( !isEmpty(action.payload.layerTemplates) ) {
        return state.immutableSetItems(new LayerTemplates(...action.payload.layerTemplates))
      }
      return state.immutableSetItems(new LayerTemplates())
    case getType(actions.visualization.fetch.failure):
      return state.immutableSetLoading(false)
    default:
      return state
  }
}
