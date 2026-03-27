// Poorman combineReducers, but it doesn't add a level of indirection on the rest (root.)
// and solves the shared state problem
import {queryReducer} from '../query/QueryReducer'
import {actionReducer} from '../action/ActionReducer'
import {authorizationReducer} from '../auth/AuthReducer'
import {browserReducer} from '../browser/BrowserReducer'
import {chartReducer} from '../chart/state/ChartReducer'
import {detailsReducer} from '../details/state/DetailsReducer'
import {fetchReducer} from '../fetch/FetchReducer'
import {filterReducer} from '../filter/state/FilterReducer'
import {floorReducer} from '../floor/FloorReducer'
import {visualizationHistoryReducer} from '../visualization/history/store/VisualizationHistoryReducer'
import {imageHistoryReducer} from '../image/ImageHistoryReducer'
import {initialRowReducer} from '../initial-row/InitialRowReducer'
import {jumpReducer} from '../jump/state/JumpReducer'
import {layerReducer} from '../layer/state/LayerReducer'
import {legendReducer} from '../legend/state/LegendReducer'
import {objectMenuReducer} from '../object/editor/state/ObjectMenuReducer'
import {settingsMenuReducer} from '../settings/SettingsMenuReducer'
import { getPaginatedRowsetReducer } from '../paginated-rowset/PaginatedRowsetReducer'
import {resourceReducer} from '../resource/ResourceReducer'
import {rowHistoryReducer} from '../row/RowHistoryReducer'
import {rowsetStoreReducer} from '../rowset/RowsetReducer'
import {objectEditorReducer} from '../object/editor/ObjectEditorReducer'
import {schemaReducer} from '../schema/SchemaReducer'
import {themeReducer} from '../theme/ThemeReducer'
import {tooltipReducer} from '../tooltip/state/TooltipReducer'
import {viewControllerReducer} from '../view-controller/ViewControllerReducer'
import {viewLayerReducer} from '../view-layer/ViewLayerReducer'
import {viewStateReducer} from '../view-state/ViewStateReducer'
import {
  visualizationFiltersReducer,
  visualizationListReducer,
  visualizationReducer,
} from '../visualization/state/VisualizationReducer'
import {worldReducer} from '../world/WorldReducer'
import {layerHelperReducer} from '../helper/LayerHelperReducer'
import {navigationReducer} from '../view/navigation/state/NavigationReducer'
import {modelHistoryReducer} from '../resource/ModelHistoryReducer'
import {layerTemplateReducer} from '../layer/template/state/LayerTemplateReducer'
import {spotlightReducer} from '@hopara/design-system/src/spotlight/state/SpotlightReducer'
import { placeReducer } from '../place/PlaceReducer'
import { ObjectFetchTarget } from '../object/state/ObjectListActions'
import { userLocationReducer } from '../user-location/UserLocationReducer'
import { gridReducer } from '../grid/GridReducer'

export const childReducers = {
  viewState: viewStateReducer, // Should come before the layerReducer, because it's used in the layer creation
  queryStore: queryReducer,
  action: actionReducer,
  auth: authorizationReducer,
  browser: browserReducer,
  chart: chartReducer,
  details: detailsReducer,
  fetch: fetchReducer,
  filterStore: filterReducer,
  floorStore: floorReducer,
  history: visualizationHistoryReducer,
  imageHistory: imageHistoryReducer,
  initialRow: initialRowReducer,
  jump: jumpReducer,
  layerStore: layerReducer,
  legends: legendReducer,
  objectMenu: objectMenuReducer,
  settingsMenu: settingsMenuReducer,
  entityObjectListStore: getPaginatedRowsetReducer(ObjectFetchTarget.ENTITY),
  searchObjectListStore: getPaginatedRowsetReducer(ObjectFetchTarget.SEARCH),
  resource: resourceReducer,
  rowHistory: rowHistoryReducer,
  rowsetStore: rowsetStoreReducer,
  objectEditor: objectEditorReducer,
  schema: schemaReducer,
  theme: themeReducer,
  tooltip: tooltipReducer,
  viewController: viewControllerReducer,
  viewLayers: viewLayerReducer,
  visualizationFilters: visualizationFiltersReducer,
  visualizationStore: visualizationReducer,
  visualizations: visualizationListReducer,
  world: worldReducer,
  layerHelper: layerHelperReducer,
  navigation: navigationReducer,
  modelHistory: modelHistoryReducer,
  layerTemplate: layerTemplateReducer,
  spotlight: spotlightReducer,
  place: placeReducer,
  userLocation: userLocationReducer,
  grid: gridReducer,
}
