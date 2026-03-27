import { ActionType } from 'typesafe-actions'
import visualizationActions from '../visualization/state/VisualizationActions'
import authActions from '../auth/AuthActions'
import queryActions from '../query/QueryActions'
import filterActions from '../filter/state/FilterActions'
import hocActions from '../hoc/HocActions'
import layerActions from '../layer/state/LayerActions'
import { viewLayerActions } from '../view-layer/ViewLayerActions'
import { navigationActions } from '../view/navigation/state/NavigationActions'
import logActions from '../log/LogActions'
import rowsetActions from '../rowset/RowsetActions'
import { actions as viewActions } from '../view/ViewActions'
import { visualizationHistoryActions } from '../visualization/history/store/VisualizationHistoryActions'
import { schemaActions } from '../schema/SchemaActions'
import { detailsActions } from '../details/state/DetailsActions'
import { floorActions } from '../floor/FloorActions'
import { settingsActions } from '../settings/SettingsActions'
import { actionActions } from '../action/ActionActions'
import legendActions from '../legend/state/LegendActions'
import { viewStateActions } from '../view-state/ViewStateActions'
import { objectEditorActions } from '../object/editor/state/ObjectEditorActions'
import { rowToolbarActions } from '../row/RowToolbarActions'
import { failureAction } from '@hopara/state'
import { rowHistoryActions } from '../row/RowHistoryActions'
import { layerHelperActions } from '../helper/LayerHelperActions'
import { lightActions } from '../lights/LightsActions'
import { imageActions } from '../resource/ImageActions'
import { modelActions } from '../resource/ModelActions'
import { resourceActions } from '../resource/ResourceActions'
import { layerTemplateActions } from '../layer/template/state/LayerTemplateActions'
import { layerEditorActions } from '../layer/editor/LayerEditorActions'
import { objectActions } from '../object/state/ObjectActions'
import { objectListActions } from '../object/state/ObjectListActions'
import { spotlightActions } from '@hopara/design-system/src/spotlight/state/SpotlightActions'
import { placeActions } from '../place/PlaceActions'
import { fitActions } from '../fit/FitActions'
import { userLocationActions } from '../user-location/UserLocationActions'
import { browserActions } from '../browser/BrowserActions'
import { gridActions } from '../grid/GridActions'

const actions = {
  visualization: visualizationActions,
  auth: authActions,
  object: objectActions,
  objectList: objectListActions,
  userLocation: userLocationActions,
  query: queryActions,
  filter: filterActions,
  hoc: hocActions,
  layer: layerActions,
  layerEditor: layerEditorActions,
  layerTemplate: layerTemplateActions,
  navigation: navigationActions,
  log: logActions,
  rowset: rowsetActions,
  view: viewActions,
  viewLayer: viewLayerActions,
  visualizationHistory: visualizationHistoryActions,
  schema: schemaActions,
  details: detailsActions,
  floor: floorActions,
  image: imageActions,
  settings: settingsActions,
  action: actionActions,
  legend: legendActions,
  viewState: viewStateActions,
  objectEditor: objectEditorActions,
  rowToolbar: rowToolbarActions,
  failure: failureAction,
  rowHistory: rowHistoryActions,
  layerHelper: layerHelperActions,
  light: lightActions,
  model: modelActions,
  resource: resourceActions,
  spotlight: spotlightActions,
  place: placeActions,
  fit: fitActions,
  browser: browserActions,
  grid: gridActions
}

export default actions
export type ActionTypes = ActionType<typeof actions>;
