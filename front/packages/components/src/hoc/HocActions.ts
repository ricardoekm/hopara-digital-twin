import {createAction} from 'typesafe-actions'
import { InitialRow } from '../initial-row/InitialRow'
import { PlainDataLoader } from '@hopara/dataset/src/loader/DataLoader'
import { CallbackFunction } from '../action/ActionReducer'
import { SelectedFilters } from '../filter/domain/SelectedFilters'
import { Authorization } from '@hopara/authorization'
import { Position } from '../view-state/ViewState'
import { Language } from '@hopara/browser'
export interface HocLoadedPayload {
  visualizationId: string,
  fallbackVisualizationId?: string
  visualizationScope?: string
  authorization: Authorization
  dataLoaders?: PlainDataLoader[]
  initialPosition?: Position
  initialRow?: InitialRow
  darkMode: boolean
  callbacks?: CallbackFunction[]
  attribution?: boolean
  filters?: SelectedFilters
  language?: Language
  navigationControls?: boolean
}

const actions = {
  // external communication
  configLoaded: createAction('HOC_CONFIG_LOADED')<HocLoadedPayload>(),
  configUpdated: createAction('HOC_CONFIG_UPDATED')<HocLoadedPayload>(),
  forceRefresh: createAction('HOC_FORCE_REFRESH')(),
  
  // state actions
  init: createAction('HOC_INITIALIZED')<HocLoadedPayload>(),
  initRequested: createAction('HOC_INIT_REQUEST')<HocLoadedPayload>(),
  configWithError: createAction('HOC_INITIALIZED_WITH_ERROR')<HocLoadedPayload & {e: Error}>(),
  visualizationChangeRequested: createAction('HOC_VISUALIZATION_CHANGE_REQUESTED')<HocLoadedPayload>(),
  visualizationChanged: createAction('HOC_VISUALIZATION_CHANGED')<HocLoadedPayload>(),
  accessTokenChanged: createAction('HOC_TOKEN_CHANGED')<{authorization: Authorization}>(),
  languageChanged: createAction('HOC_LANGUAGE_CHANGED')<HocLoadedPayload>(),
  loaderChanged: createAction('HOC_LOADER_CHANGED')<{dataLoaders: PlainDataLoader[]}>(),
  filterChanged: createAction('HOC_FILTER_CHANGED')<{filters: SelectedFilters}>(),
  initialRowChanged: createAction('HOC_INITIAL_ROW_CHANGED')<{initialRow: InitialRow}>(),

  broadcastUpdate: createAction('HOC_BROADCAST_UPDATE')<{cacheName: string, url: string, tenant: string, response: any}>(),
}

export default actions
