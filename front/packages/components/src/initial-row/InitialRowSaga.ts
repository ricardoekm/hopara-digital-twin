import {call, put, select, takeEvery} from '@redux-saga/core/effects'
import { InitialRow } from './InitialRow'
import { Store } from '../state/Store'
import { Layers } from '../layer/Layers'
import { Data } from '@hopara/encoding'
import QueryStore from '../query/QueryStore'
import { BackendDatasetRepository, DatasetService, Query } from '@hopara/dataset'
import { Authorization } from '@hopara/authorization'
import { PositionNormalizer } from '@hopara/projector'
import actions from '../state/Actions'
import { takeBoth } from '@hopara/state'
import { Logger } from '@hopara/internals'
import { getRefreshAuthorization } from '../auth/AuthSaga'

function* getRow(data: Data, rowId: string, scope?: string) {
  const queryStore: QueryStore = yield select((store: Store): QueryStore => store.queryStore)
  const query = queryStore.queries.findQuery(data.getQueryKey()) as Query
  const authorization: Authorization = yield getRefreshAuthorization()
  const datasetService = new DatasetService(new BackendDatasetRepository())
  return yield call(datasetService.getRow.bind(datasetService), rowId, query, scope, authorization)
}

export function* navigateToInitialRow() {
  const initialRow: InitialRow | undefined = yield select((store: Store) => store.initialRow)
  if (!initialRow) return

  const layers: Layers = yield select((store: Store) => store.layerStore.layers)
  const layer = layers.getById(initialRow.layerId)

  // TODO: we need to implement the navigation params on the layer to ignore the entity
  if (!layer?.encoding.position) return

  try {
    const positionNormalizer = new PositionNormalizer()
    let row = yield* getRow(layer.getPositionData() ?? new Data(), initialRow.rowId, layer.getPositionEncoding()?.scope)
    row = positionNormalizer.normalize(row, layer.encoding.position)
    if (!row?.isPlaced()) return

    yield put(actions.object.navigateToInitialRow({layer, row}))
  } catch (e: any) {
    Logger.warn(`initial row not loaded: ${e.message}`)
  }
}

export const initialRowSagas = () => [
  takeBoth(actions.view.viewLoaded, actions.visualization.fetch.success, navigateToInitialRow),
  takeEvery(actions.hoc.initialRowChanged, navigateToInitialRow)
]
