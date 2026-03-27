import {call, delay, put, select, takeLatest} from '@redux-saga/core/effects'
import actions from '../state/Actions'
import { LayerStore } from '../layer/state/LayerStore'
import { Store } from '../state/Store'
import QueryStore from '../query/QueryStore'
import { Authorization } from '@hopara/authorization'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { BackendDatasetRepository } from '@hopara/dataset'
import { PositionNormalizer } from '@hopara/projector'
import { Logger } from '@hopara/internals'
import { VisualizationStore } from '../visualization/state/VisualizationStore'
import ViewState, { DEFAULT_TRANSITION_ORBIT_DURATION, DEFAULT_TRANSITION_ORBIT_STEP_SIZE } from './ViewState'
import { takeEveryAndRepeat } from '@hopara/state'
import { takeEveryAndLoop } from '@hopara/state'
import { FilterType, getDatasetFilters } from '../rowset/DatasetFiltersService'
import { isEmpty } from 'lodash'
import Visualization from '../visualization/Visualization'
import { Layers } from '../layer/Layers'
import { Rowset } from '../rowset/Rowset'
import { testCondition } from '@hopara/encoding'

export function* goToClosestRow(action: ReturnType<typeof actions.layer.selected>) {
  const visualization:VisualizationStore = yield select((store: Store) => store.visualizationStore)
  if (!(visualization.visualization.isGeo() || visualization.visualization.isWhiteboard())) return

  const layerStore: LayerStore = yield select((store: Store) => store.layerStore)
  const layer = layerStore.layers.getById(action.payload.id)
  if (!layer) return

  const positionFields = layer.encoding.position?.getFields()
  if (isEmpty(positionFields)) return

  const queryStore: QueryStore = yield select((store: Store) => store.queryStore)
  const query = queryStore.queries.findQuery(layer.getPositionQueryKey())
  if (!query) return

  const viewState:ViewState = yield select((store: Store) => store.viewState)
  const authorization: Authorization = yield getRefreshAuthorization()

  const datasetFilters = yield getDatasetFilters([FilterType.SELECTED, FilterType.FLOOR], layer)

  try {
    const datasetRepository = new BackendDatasetRepository()
    const response = yield call(datasetRepository.getRows.bind(datasetRepository),
      {
        query,
        distanceSort: {
          columns: positionFields!,
          coordinates: viewState.getCoordinates().toArray(),
        },
        filterSet: { filters: datasetFilters,
                     limit: 1 },
        authorization,
    })

    if (response.rows.length === 0) return
    const positionNormalizer = new PositionNormalizer()
    const normalizedRow = positionNormalizer.normalize(response.rows[0], layer.encoding.position)
    if (viewState.isRowInRange(normalizedRow.getCoordinates())) return

    yield put(actions.object.panTo({row: normalizedRow}))
  } catch (e: any) {
    Logger.error(e)
  }
}

function* notifyTransitionRotate() {
  // the interval should be same as the interval in takeEveryAndRepeat
  const config = {step: DEFAULT_TRANSITION_ORBIT_STEP_SIZE, interval: DEFAULT_TRANSITION_ORBIT_DURATION}
  yield put(actions.viewState.transitionRotate(config))
}

export function* autoNavigate() {
  const TRANSITION_SLEEP_TIME = 5000
  const visualization: Visualization = yield select((store: Store) => store.visualizationStore.visualization)
  if (!visualization.autoNavigation) return

  const layers: Layers = yield select((store: Store) => store.layerStore.layers)
  const layer = layers.getById(visualization.autoNavigation.layerId)
  if (!layer) {
    Logger.error('Layer not found for auto navigation:', visualization.autoNavigation.layerId)
    return
  }

  const rowset: Rowset = yield select((store: Store) => store.rowsetStore.getRowset(layer.getRowsetId()))
  if (!rowset) {
    Logger.error('Auto navigation rowset not found', layer.getRowsetId())
    return
  }

  let navigateRows = rowset.rows
  if (visualization.autoNavigation.condition) {
    navigateRows = navigateRows.filter((row) => row.isPlaced() && testCondition(visualization.autoNavigation?.condition, row))
  }

  for (const row of navigateRows) {
    yield put(actions.object.navigateTo({row, layer}))
    yield delay(TRANSITION_SLEEP_TIME)
    yield put(actions.navigation.initialPositionRequested())
    yield delay(TRANSITION_SLEEP_TIME * 2)
  }
}

export const viewStateSagas = () => [
  takeLatest(actions.layer.selected, goToClosestRow),
  takeEveryAndRepeat(actions.navigation.startAutoRotateClicked, DEFAULT_TRANSITION_ORBIT_DURATION, notifyTransitionRotate, [
    actions.navigation.stopAutoRotateClicked,
    actions.view.viewDragStart,
  ]),
  takeEveryAndLoop(actions.navigation.startAutoNavigateClicked, autoNavigate, [
    actions.navigation.stopAutoNavigateClicked,
    actions.view.viewDragStart,
  ])
]
