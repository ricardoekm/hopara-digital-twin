import {call, debounce, delay, put, select, take, takeLatest} from '@redux-saga/core/effects'
import {buffers, END, eventChannel} from 'redux-saga'
import { FetchController, FetchControllerToken } from '../rowset/fetch/FetchController'
import {container} from 'tsyringe'
import {Rowset} from './Rowset'
import {RowsetStore} from './RowsetStore'
import {Layers} from '../layer/Layers'
import Visualization from '../visualization/Visualization'
import QueriesStore from '../query/QueryStore'
import { Logger } from '@hopara/internals'
import actions from '../state/Actions'
import {DatasetService} from '@hopara/dataset/src/service/DatasetService'
import {
  BackendDatasetRepository,
  LoaderDatasetRepository,
  Queries,
  Query,
} from '@hopara/dataset'
import {Store} from '../state/Store'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {World} from '../world/World'
import {takeBufferedLeadingPerKeyWithCancel} from '@hopara/state'
import {FloorStore} from '../floor/FloorStore'
import {isNumber} from 'lodash/fp'
import {SelectedFilters} from '../filter/domain/SelectedFilters'
import Case from 'case'
import { getFilters } from '../filter/DatasetFiltersFactory'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { takeOnce } from '@hopara/state'
import {ResourceType} from '@hopara/resource'
import { getAllColumns, getAutoFilledFilters } from './DatasetFiltersService'
import ViewState from '../view-state/ViewState'
import { FetchStateFactory, FetchStateFactoryToken } from './fetch/FetchStateFactory'

const getRowsetStore = (store: Store) => store.rowsetStore
const getViewState = (store: Store) => store.viewState
const getLayers = (store: Store) => store.layerStore.layers
const getVisualization = (store: Store) => store.visualizationStore.visualization
const getQueriesStore = (store: Store) => store.queryStore
const getWorld = (store: Store) => store.world

export function* refreshData() {
  const rowsetStore: RowsetStore = yield select(getRowsetStore)
  const layers: Layers = yield select(getLayers)
  const visualization: Visualization = yield select(getVisualization)
  const world: World = yield select(getWorld)
  const viewState = yield select(getViewState)
  const queryStore: QueriesStore = yield select(getQueriesStore)

  if (!viewState || !world) return

  const fetchController = container.resolve<FetchController>(FetchControllerToken)
  const rowsets = fetchController.getRowsetsToFetch(layers, rowsetStore.getRowsets(), viewState)
  const prefetchs = fetchController.getPrefetchs(layers, rowsetStore.getRowsets(), viewState)
  const subscribeQueries = new Queries()

  // We need to send the filters and floors here so that they spawn a new request on the saga,
  // otherwise they will wait to be dispatched after the current one finishes
  const selectedFilters: SelectedFilters = rowsets.length || prefetchs.length ? yield getAutoFilledFilters() : new SelectedFilters()
  const floors: FloorStore = yield select((store: Store) => store.floorStore)

  if (rowsets.length > 0) {
    for (const rowset of rowsets) {
      yield put(actions.rowset.fetchDataRequested({
        visualization,
        rowset,
        viewState,
        selectedFilters,
        prefetch: false,
        floor: floors.getCurrent(),
      }))

      const query = queryStore.queries.findQuery(rowset.getQueryKey())
      if (query) {
        subscribeQueries.push(query)
      }
    }
  }

  for (const prefetch of prefetchs) {
    yield put(actions.rowset.fetchDataRequested({
      visualization,
      rowset: prefetch.rowset as Rowset,
      viewState: prefetch.targetViewState,
      selectedFilters,
      prefetch: true,
      floor: floors.getCurrent(),
    }))
  }
}

function getTransformParams(rowset: Rowset) {
  const transform = rowset.data.transform
  if (transform) {
    return {type: Case.constant(transform.type), ...transform.getParams()}
  }

  return undefined
}

function createFetchRowFunctionChannel<Fn extends(...args: any[]) => any>(fn: Fn, ...args: Parameters<Fn>) {
  return eventChannel((emitter) => {
    fn({...args[0], downloadProgressCallback: (p) => emitter({progress: p})})
      .then((response) => {
        setTimeout(() => {
          emitter({...response, success: true})
          emitter(END)
        }, 100)
      })
      .catch((err) => {
        emitter({err})
        emitter(END)
      })

    return () => ({})
  }, buffers.sliding(2) as any)
}

export function* fetchData(action: ReturnType<typeof actions.rowset.fetchDataRequested>) {
  const queryStore: QueriesStore = yield select(getQueriesStore)

  const rowset = action.payload.rowset
  const dataQuery = queryStore.queries.findQuery(rowset.getQueryKey())
  if (!dataQuery) {
    Logger.warn('Data query not found', rowset.getQueryKey())
    return
  }

  const positionQuery = queryStore.queries.findQuery(rowset.getPositionQueryKey())
  if (!positionQuery) {
    Logger.warn('Position query not found', rowset.getPositionQueryKey())
    return
  }

  const visualization: Visualization = yield select((store: Store) => store.visualizationStore.visualization)
  const viewState: ViewState = yield select(getViewState)

  const fetchBoxQuery = new Query(positionQuery || dataQuery)
  // If is hopara managed and the user sets smart load on the data query, we should smart load the position
  // this can be helpful for image layers to reduce the memory consumption and fetched images
  fetchBoxQuery.smartLoad = positionQuery.smartLoad || dataQuery.smartLoad

  const fetchController = container.resolve<FetchController>(FetchControllerToken)
  const fetchBox = fetchController.getFetchBox(fetchBoxQuery, visualization.type, visualization.bleedFactor, viewState.getVisibleWorld())

  const allColumns = yield getAllColumns(rowset)
  const filters = getFilters(action.payload.selectedFilters, rowset.positionEncoding, allColumns, action.payload.floor, fetchBox)
  yield put(actions.rowset.fetch.request({rowset}))

  const authorization: Authorization = yield getRefreshAuthorization()

  try {
    const queryLoader = queryStore.loaders.getLoader(dataQuery)
    const fetchStateFactory = container.resolve<FetchStateFactory>(FetchStateFactoryToken)
    const fetchState = fetchStateFactory.create(fetchBox)

    let response
    if (queryLoader) {
      const datasetService = new DatasetService(new LoaderDatasetRepository(queryLoader.loader, queryLoader.cache))

      response = yield call(datasetService.getRows.bind(datasetService),
      {
        query: dataQuery,
        positionQuery,
        transformParams: getTransformParams(rowset),
        filterSet: { filters },
        authorization,
      },
      )
      const payload = {rowset: action.payload.rowset.fill(response.rows, fetchState)}
      yield put(actions.rowset.fetch.success(payload))
    } else {
      const datasetService = new DatasetService(new BackendDatasetRepository())
      const channel = yield call(
        createFetchRowFunctionChannel,
        datasetService.getRows.bind(datasetService),
        {
          query: dataQuery,
          positionQuery,
          transformParams: getTransformParams(rowset),
          filterSet: { filters },
          calculateStats: action.payload.visualization.isFetchScope(),
          authorization,
        })

      const progressPayload = {key: rowset.getId(), entity: ResourceType.data, progress: 0}
      yield put(actions.rowset.fetchDataProgress(progressPayload))

      while (true) {
        const {progress = 0, err, success, rows} = yield take(channel)
        if (err) {
          yield put(actions.rowset.fetch.failure({
            reason: i18n('FETCH_DATA_FAILED'),
            exception: err,
            rowset: action.payload.rowset,
          }))
          yield put(actions.rowset.fetchDataProgress({...progressPayload, progress: undefined}))
          return
        } else if (success) {
          const payload = {rowset: (action.payload.rowset).fill(rows, fetchState)}
          yield put(actions.rowset.fetch.success(payload))
          yield put(actions.rowset.fetchDataProgress({...progressPayload, progress: undefined}))
          return
        }
        yield put(actions.rowset.fetchDataProgress({...progressPayload, progress}))
      }
    }
  } catch (e: any) {
    yield put(actions.rowset.fetch.failure({
      reason: i18n('FETCH_DATA_FAILED'),
      exception: e,
      rowset: action.payload.rowset,
    }))
  }
}

function selectRowsetId(action) {
  if (action.payload.rowset) {
    return action.payload.rowset.getId()
  }

  return action.payload.rowsetId
}

function selectFetchRequestPayload(action) {
  return {
    filters: action.payload.selectedFilters,
    viewState: action.payload.viewState,
    floor: action.payload.floor,
  }
}

function* periodicallyRefresh() {
  try {
    while (true) {
      const visualization: Visualization = yield select(getVisualization)
      if (!visualization) {
        break
      }

      if (isNumber(visualization.refreshPeriod)) {
        yield delay(visualization.refreshPeriod * 1000)
        yield put(actions.rowset.refresh())
      } else {
        // We'll check again later in case the configuration changes
        yield delay(60 * 1000)
      }
    }
  } catch (error: any) {
    yield put(actions.failure({reason: 'REFRESH_ERROR', exception: error}))
  }
}


export function* watchForInitialLoadComplete() {
  const rowsetStore: RowsetStore = yield select(getRowsetStore)
  if (rowsetStore.allLoaded()) {
    yield put(actions.rowset.loadComplete())
  }
}

function notifyRowsetLoadComplete() {
  window.postMessage({type: 'rowsetLoadComplete'}, '*')
}

export const rowsetSagas = () => [
  takeOnce(actions.visualization.fetch.success, periodicallyRefresh),
  takeLatest(actions.rowset.fetch.success, watchForInitialLoadComplete),
  takeLatest(actions.rowset.refresh, refreshData),
  takeLatest(actions.rowset.rowSave.success, refreshData),
  takeLatest(actions.filter.loadValues.success, refreshData),
  takeLatest(actions.floor.changed, refreshData),
  takeLatest(actions.floor.checked, refreshData),
  takeLatest(actions.floor.added, refreshData),
  takeLatest(actions.navigation.floorChangeRequested, refreshData),
  // when placing out of range we'll need to load the rowset for the other rows load
  takeLatest(actions.rowset.rowSave.success, refreshData),
  takeLatest(actions.filter.valueChanged, refreshData),
  takeLatest(actions.filter.dateChanged, refreshData),
  takeLatest(actions.filter.comparisonTypeChanged, refreshData),
  takeLatest(actions.layer.toHoparaManaged.success, refreshData),
  takeLatest(actions.layer.changed, refreshData),
  takeLatest(actions.query.changed, refreshData),

  // in case the layer is out of zoom range it might need row load
  takeLatest(actions.layer.selected, refreshData),
  debounce(1000, actions.layer.visibilityChanged, refreshData),
  takeBufferedLeadingPerKeyWithCancel(actions.rowset.fetchDataRequested, fetchData, selectRowsetId,
                                      actions.viewLayer.dragStarted, selectFetchRequestPayload),
  takeLatest(actions.rowset.loadComplete, notifyRowsetLoadComplete),
]
