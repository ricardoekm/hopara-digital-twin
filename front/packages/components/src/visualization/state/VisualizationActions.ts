import {createAction, createAsyncAction} from 'typesafe-actions'
import {Layers} from '../../layer/Layers'
import {Queries} from '@hopara/dataset'
import {Authorization} from '@hopara/authorization'
import {Filters} from '../../filter/domain/Filters'
import Visualization, {VisualizationType} from '../Visualization'
import ViewState from '../../view-state/ViewState'
import {ViewController} from '../../view-controller/ViewController'
import {World} from '../../world/World'
import {SelectedFilters} from '../../filter/domain/SelectedFilters'
import {Legends} from '../../legend/Legends'
import {Floor} from '../../floor/Floor'
import {VisualizationRouteParams} from '../VisualizationRouteProvider'
import {Action} from '../../action/Action'
import {LayerDefaults} from '../../layer/LayerDefaults'
import {SettingsMenuItemId} from '../../settings/SettingsMenu'
import {LayerTemplate} from '../../layer/template/domain/LayerTemplate'
import {HttpError} from '@hopara/http-client'
import {Floors} from '../../floor/Floors'
import { Grid } from '../../grid/Grid'
import { AutoNavigation } from '../../auto-navigation/AutoNavigation'

export interface VisualizationViewLoadedPayload {
  params: VisualizationRouteParams
  oldParams?: VisualizationRouteParams
  oldVisualizationType?: VisualizationType
  tenant?: string
  jumpBack?: boolean
}

export interface FetchVisualizationSuccess {
  history: any[]
  schema: any,
  layers: Layers,
  layerDefaults: LayerDefaults
  layerTemplates: LayerTemplate[]
  queries: Queries,
  legends: Legends,
  authorization?: Authorization,
  filters: Filters,
  selectedFilters: SelectedFilters,
  visualization: Visualization,
  scope?: string,
  viewState: ViewState,
  viewController: ViewController,
  world: World,
  floor?: Floor,
  floors: Floors,
  version?: number,
  fallbackVisualizationId?: string
  grids: Grid[]
}

export interface FetchVisualizationFailure extends FetchVisualizationSuccess {
  reason: string,
  exception: Error,
}

const actions = {
  fetch: createAsyncAction(
    'FETCH_VISUALIZATION_REQUEST',
    'FETCH_VISUALIZATION_SUCCESS',
    'FETCH_VISUALIZATION_FAILURE',
  )<{ visualizationId: string }, FetchVisualizationSuccess, FetchVisualizationFailure>(),

  list: createAsyncAction(
    'LIST_VISUALIZATIONS_REQUEST',
    'LIST_VISUALIZATIONS_SUCCESS',
    'LIST_VISUALIZATIONS_FAILURE',
  )<void, Visualization[], { exception: Error }>(),
  refreshed: createAction('VISUALIZATION_REFRESHED')<FetchVisualizationSuccess>(),
  pageLoaded: createAction('VISUALIZATION_PAGE_LOADED')<VisualizationViewLoadedPayload>(),
  routeChanged: createAction('VISUALIZATION_PAGE_CHANGED')<VisualizationViewLoadedPayload>(),
  actionSelected: createAction('VISUALIZATION_ACTION_SELECTED')<{ actionId?: string }>(),
  actionChanged: createAction('VISUALIZATION_ACTION_CHANGED')<{ action: Action }>(),
  newActionRequested: createAction('VISUALIZATION_NEW_ACTION_REQUESTED')<void>(),
  actionDeleted: createAction('VISUALIZATION_ACTION_DELETED')<{ actionId: string }>(),
  actionMoved: createAction('VISUALIZATION_ACTION_MOVED')<{ sourceIndex: number, destinationIndex: number }>(),
  refreshPeriodChanged: createAction('VISUALIZATION_REFRESH_PERIOD_CHANGED')<{ refreshPeriod?: number }>(),
  autoNavigationChanged: createAction('VISUALIZATION_AUTO_NAVIGATION_CHANGED')<{ autoNavigation?: AutoNavigation }>(),
  edited: createAction('VISUALIZATION_EDITED')<{ change: Partial<Visualization> & Partial<ViewState> }>(),
  changed: createAction('VISUALIZATION_CHANGED')<void>(),
  advancedModeClicked: createAction('VISUALIZATION_ADVANCED_MODE_CLICKED')<{
    area: SettingsMenuItemId,
    enabled: boolean
  }>(),

  listFilters: createAsyncAction(
    'LIST_VISUALIZATION_FILTERS_REQUEST',
    'LIST_VISUALIZATION_FILTERS_SUCCESS',
    'LIST_VISUALIZATION_FILTERS_FAILURE',
  )<{ visualizationId: string }, { filters: Filters }, { exception: Error }>(),
  fullScreenRequested: createAction('VISUALIZATION_FULL_SCREEN_REQUESTED')<{ fullScreen: boolean }>(),
  listVisualizationPageLoaded: createAction('LIST_VISUALIZATION_PAGE_LOADED')<void>(),
  editorDirtyExitClicked: createAction('VISUALIZATION_EDITOR_DIRTY_EXIT_CLICKED')<void>(),
  editorDiscardChangesRequest: createAction('VISUALIZATION_EDITOR_DISCARD_CHANGES_REQUEST')<void>(),
  save: createAsyncAction(
    'VISUALIZATION_SAVE_REQUEST',
    'VISUALIZATION_SAVE_SUCCESS',
    'VISUALIZATION_SAVE_FAILURE',
  )<void, void, { exception: HttpError }>(),
  dismissExitClicked: createAction('VISUALIZATION_DISMISS_EXIT_CLICKED')<void>(),
  panelCloseClicked: createAction('VISUALIZATION_PANEL_CLOSE_CLICKED')<void>(),
}

export default actions
