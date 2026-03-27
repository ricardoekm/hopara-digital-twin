import {createAction} from 'typesafe-actions'
import {VisualizationViewLoadedPayload} from '../visualization/state/VisualizationActions'
import {MapStyle} from '@hopara/encoding'

interface MapStylePayload {
  mapStyle: MapStyle
  temporary?: boolean
}

export const settingsActions = {
  pageLoaded: createAction('SETTINGS_PAGE_LOADED')<VisualizationViewLoadedPayload>(),
  setMapStyle: createAction('SETTINGS_SET_MAP_STYLE')<MapStylePayload>(),
  itemSelected: createAction('MENU_ITEM_SELECTED')<{ id?: string }>(),
  itemUnselected: createAction('MENU_ITEM_UNSELECTED')(),
}

