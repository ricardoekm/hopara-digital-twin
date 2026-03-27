import {call, put, select, takeEvery} from '@redux-saga/core/effects'
import actions from '../../state/Actions'
import {Store} from '../../state/Store'
import {ActionType} from '../../action/Action'
import {Layer} from '../Layer'
import {Authorization} from '@hopara/authorization'
import {getRefreshAuthorization} from '../../auth/AuthSaga'
import {Logger} from '@hopara/internals'
import {toastError} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import {TableService} from '../../table/TableService'
import { Data } from '@hopara/encoding'
import {Area} from '../../visualization/pages/Area'
import { Query } from '@hopara/dataset'
import { isEmpty } from 'lodash'
import { Layers } from '../Layers'

function* layerSelected(action: ReturnType<typeof actions.layer.selectAction>) {
  const layer: Layer = yield select((store: Store) => store.layerStore.getSelectedLayer())
  const act = layer?.actions.find((act) => act.id === action.payload.actionId)
  if (act?.type === ActionType.VISUALIZATION_JUMP) {
    const visualizationId = act.visualization
    if (visualizationId) {
      yield put(actions.visualization.listFilters.request({visualizationId}))
    }
  }
}

async function upsertTable(tableName: string, authorization: Authorization) {
  const tableService = new TableService()
  return await tableService.upsert(tableName, authorization)
}

function* createTable(action: ReturnType<typeof actions.layer.toHoparaManaged.request>) {
  try {
    const authorization: Authorization = yield getRefreshAuthorization()
    const response = yield call(upsertTable, action.payload.data.query, authorization)
    yield put(actions.layer.toHoparaManaged.success({layer: action.payload.layer, queries: response}))
  } catch (e: any) {
    Logger.error(e)
    toastError(i18n('CREATE_TABLE_FAILED'))
    yield put(actions.layer.toHoparaManaged.failure({layer: action.payload.layer}))
  }
}

function* layerCreateQuery() {
  const layer = (yield select((store: Store) => store.layerStore.getSelectedLayer())) as Layer
  if (layer.hasParent()) {
    return
  }

  yield put(actions.layer.toHoparaManaged.request({layer, data: Data.internal(layer.getId())}))
}

function* handleLayerClick(action: ReturnType<typeof actions.viewLayer.click>) {
  try {
    const isOnLayerEditor = yield select((store: Store) => store.visualizationStore.area === Area.LAYER_EDITOR)
    if (isOnLayerEditor) return

    const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(action.payload.layerId)!)

    const isOnObjectEditor = yield select((store: Store) => store.visualizationStore.isOnObjectEditor())
    const positionQuery: Query = yield select((store: Store) => store.queryStore.queries.findQuery(layer.getPositionQueryKey()))
    const isLayerUpdatable = layer.canMove(positionQuery?.canUpdate())

    if ( !isOnObjectEditor || !isLayerUpdatable ) {
      const objectClickActions = layer.actions.getObjectClickActions()
      let showDetails = false
      for (const objectClickAction of objectClickActions) {
        if ( !showDetails && objectClickAction.showDetails ) {
          showDetails = true
        }

        yield put(actions.action.objectActionTriggered({
          row: action.payload.row,
          layerId: action.payload.layerId,
          action: objectClickAction,
          navigation: action.payload.navigation,
          pixel: action.payload.pixel,
        }))
      }

      if ( objectClickActions.length > 0 && !showDetails ) {
        return
      }
    }

    if (!isOnObjectEditor && layer.details?.enabled === false) return

    yield put(actions.details.open({
      row: action.payload.row,
      layerId: action.payload.layerId,
    }))
  } catch (e: any) {
    yield put(actions.log.genericError({reason: 'Failed to open layer details', exception: e}))
  }
}

function* handleLayerHover(action: ReturnType<typeof actions.viewLayer.mouseHover>) {
  const isOnObjectEditor = yield select((store: Store) => store.visualizationStore.isOnObjectEditor())
  if (isOnObjectEditor) return

  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(action.payload.layerId)!)
  if ( isEmpty(layer.actions.getObjectHoverActions()) ) {
    return
  }

  for (const objectHoverAction of layer.actions.getObjectHoverActions()) {
    yield put(actions.action.objectActionTriggered({
      row: action.payload.row,
      layerId: action.payload.layerId,
      action: objectHoverAction,
      navigation: action.payload.navigation,
      pixel: action.payload.pixel,
    }))
  }
}

function* handleLayerLeft(action: ReturnType<typeof actions.viewLayer.mouseLeft>) {
  const isOnObjectEditor = yield select((store: Store) => store.visualizationStore.isOnObjectEditor())
  if (isOnObjectEditor) return

  const layers: Layers = yield select((store: Store) => store.layerStore.layers)
  for ( const layer of layers ) {
    const objectLeftActions = layer.actions.getObjectLeftActions()
    for (const objectLeftAction of objectLeftActions) {
      yield put(actions.action.objectActionTriggered({
        navigation: action.payload.navigation,
        layerId: layer.getId(),
        action: objectLeftAction
      }))
    }
  }
}

export const layerSagas = () => [
  takeEvery(actions.viewLayer.click, handleLayerClick),
  takeEvery(actions.viewLayer.mouseHover, handleLayerHover),
  takeEvery(actions.viewLayer.mouseLeft, handleLayerLeft),
  takeEvery(actions.layer.selectAction, layerSelected),
  takeEvery(actions.layer.created, layerCreateQuery),
  takeEvery(actions.layer.toHoparaManaged.request, createTable),
]
