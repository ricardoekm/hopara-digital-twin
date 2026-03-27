import {all} from '@redux-saga/core/effects'
import {fetchVisualizationSagas} from '../visualization/state/FetchVisualizationSaga'
import {objectSagas} from '../object/state/ObjectSaga'
import {filterSagas} from '../filter/state/FilterSaga'
import {layerSagas} from '../layer/state/LayerSaga'
import {logSagas} from '../log/LogSaga'
import {querySagas} from '../query/QuerySaga'
import {rowSagas} from '../row/RowSaga'
import {rowsetSagas} from '../rowset/RowsetSaga'
import {schemaSagas} from '../schema/SchemaSaga'
import {notificationSagas} from '../notification/NotificationSaga'
import {visualizationSagas} from '../visualization/state/VisualizationSaga'
import { historySagas } from '../visualization/history/store/VisualizationHistorySaga'
import { floorSagas } from '../floor/FloorSaga'
import {imageSagas} from '../image/ImageSaga'
import { actionSagas } from '../action/ActionSaga'
import { viewStateSagas } from '../view-state/ViewStateSaga'
import { initialRowSagas } from '../initial-row/InitialRowSaga'
import { hocSagas } from '../hoc/HocSaga'
import { rowHistorySagas } from '../row/RowHistorySaga'
import { layerHelperSagas } from '../helper/LayerHelperSaga'
import {modelSagas} from '../resource/ModelSaga'
import {layerTemplateSagas} from '../layer/template/state/LayerTemplateSaga'
import { placeSagas } from '../place/PlaceSaga'
import { fitSagas } from '../fit/FitSaga'
import { userLocationSagas } from '../user-location/UserLocationSaga'
import { browserSagas } from '../browser/BrowserSaga'

export function mergedSagas() {
  return [
    actionSagas,
    objectSagas,
    userLocationSagas,
    fetchVisualizationSagas,
    filterSagas,
    floorSagas,
    historySagas,
    hocSagas,
    imageSagas,
    initialRowSagas,
    layerHelperSagas,
    layerSagas,
    logSagas,
    modelSagas,
    notificationSagas,
    querySagas,
    rowHistorySagas,
    rowSagas,
    rowsetSagas,
    fitSagas,
    schemaSagas,
    viewStateSagas,
    visualizationSagas,
    layerTemplateSagas,
    placeSagas,
    browserSagas,
  ].reduce((acc: any, saga) => {
    return acc.concat(saga())
  }, [])
}

export function* rootSaga() {
  yield all(mergedSagas())
}

