import { call, delay, put, select, takeEvery } from '@redux-saga/core/effects'
import { RowsetStore } from '../rowset/RowsetStore'
import { Authorization } from '@hopara/authorization'
import actions from '../state/Actions'
import { DatasetService, Query, Row, Z_INDEX_COLUMN_NAME } from '@hopara/dataset'
import { Store } from '../state/Store'
import { i18n } from '@hopara/i18n'
import { takeBufferedLeadingPerKey, takeLatestPerKey } from '@hopara/state'
import { PositionNormalizer } from '@hopara/projector'
import { Layer } from '../layer/Layer'
import { toastError, toastSuccess } from '@hopara/design-system/src/toast/Toast'
import { isNil } from 'lodash/fp'
import { Logger } from '@hopara/internals'
import { createRow as getNewRow } from './RowService'
import { PaginatedRowset } from '../paginated-rowset/PaginatedRowset'
import { getType } from 'typesafe-actions'
import { PositionEncoding } from '@hopara/encoding'
import { RowCoordinates } from '@hopara/spatial'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { Rowset } from '../rowset/Rowset'

const positionNormalizer = new PositionNormalizer()

function* saveRow(action: ReturnType<
  typeof actions.rowset.rowFieldsSaveRequested |
  typeof actions.rowset.rowPositionSaveRequested
>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const datasetService = new DatasetService()

  if (isNil(action.payload.row._id)) {
    return yield put(actions.rowset.rowSave.failure({ reason: i18n('ROW_WITHOUT_ID'), exception: new Error() }))
  }

  try {
    yield call(
      datasetService.updateRow.bind(datasetService),
      action.payload.query,
      action.payload.row._id!,
      action.payload.updateRowData,
      action.payload.positionEncoding?.scope,
      authorization
    )

    yield put(actions.rowset.rowSave.success({
      row: action.payload.row,
      rowsetId: action.payload.rowsetId,
      isUndo: action.payload.isUndo
    }))
  } catch (e: any) {
    yield put(actions.rowset.rowSave.failure({ reason: i18n('ROW_UPDATE_FAILED'), exception: e }))
  }
}

export function* savePosition(action: ReturnType<
  typeof actions.viewLayer.dragEnded |
  typeof actions.object.unplaced |
  typeof actions.object.placed |
  typeof actions.image.boundsCreated |
  typeof actions.rowHistory.rowUndoRequested
>) {
  const rowset = yield select((store: Store) => store.rowsetStore.getRowset(action.payload.rowsetId))
  const query = yield select((store: Store) => store.queryStore.queries.findQuery(rowset.getPositionData()?.getQueryKey()))
  const row = rowset.rows.getById(action.payload.row._id)!

  yield put(actions.rowset.rowPositionSaveRequested({
    query,
    row,
    rowsetId: action.payload.rowsetId,
    updateRowData: positionNormalizer.getPositionValues(row, rowset.positionEncoding),
    positionEncoding: rowset.positionEncoding,
    isUndo: action.type === getType(actions.rowHistory.rowUndoRequested),
    layerId: action.payload.layerId
  }))
}

export function* saveFields(action: ReturnType<typeof actions.object.fieldsUpdated | 
                                               typeof actions.object.appearanceUpdated | 
                                               typeof actions.object.zIndexUpdated>) {
  const rowset = yield select((store: Store) => store.rowsetStore.getRowset(action.payload.rowsetId))
  const query = yield select((store: Store) => store.queryStore.queries.findQuery(action.payload.data.getQueryKey()))
  const row = rowset.rows.getById(action.payload.row._id)!

  yield put(actions.rowset.rowFieldsSaveRequested({
    query,
    row,
    updateRowData: action.payload.updatedFields,
    rowsetId: action.payload.rowsetId,
    isUndo: false
  }))
}

function* createRow(action: ReturnType<typeof actions.object.create.request>) {
  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(action.payload.layerId))
  const query: Query = yield select((store: Store) => store.queryStore.queries.findQuery(layer.getQueryKey()))
  const positionQuery: Query = yield select((store: Store) => store.queryStore.queries.findQuery(layer.getPositionQueryKey()))
  const rowset: PaginatedRowset = yield select((store: Store) => store.entityObjectListStore.getRowset(layer.getRowsetId()))
  const authorization: Authorization = yield getRefreshAuthorization()

  const newRow = getNewRow(layer, query, rowset)
  if (!newRow) return

  try {
    const service = new DatasetService()
    const [primaryKey] = yield call(
      service.createRow.bind(service),
      newRow,
      query,
      authorization
    )

    const row = new Row({
      ...newRow,
      _id: primaryKey,
      [query.columns.getPrimaryKey()!.name]: primaryKey
    })

    // Check for backward compatibility, old queries don't have z index column
    if (positionQuery.getColumns().has(Z_INDEX_COLUMN_NAME) ) {
      row[Z_INDEX_COLUMN_NAME] = 0
    }

    yield put(actions.object.create.success({ row, rowsetId: layer.getRowsetId(), layerId: layer.getId() }))
  } catch (e: any) {
    Logger.error(e)
    yield put(actions.object.create.failure())
    toastError(i18n('ROW_CREATION_FAILED'))
    return
  }
}

function* deleteRow(action: ReturnType<typeof actions.object.delete.request>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(action.payload.layerId))
  const query: Query = yield select((store: Store) => store.queryStore.queries.findQuery(layer.getQueryKey()))
  const dataQuery: Query = yield select((store: Store) => store.queryStore.queries.findQuery(layer.getPositionQueryKey()))

  try {
    const datasetService = new DatasetService()
    yield call(
      datasetService.deleteRow.bind(datasetService),
      action.payload.row._id!,
      query,
      authorization
    )

    if (dataQuery && dataQuery !== query) {
      yield call(
        datasetService.deleteRow.bind(datasetService),
        action.payload.row._id!,
        dataQuery,
        authorization
      )
    }
  } catch (e: any) {
    Logger.error(e)
    yield put(actions.object.delete.failure())
    toastError(i18n('ROW_DELETION_FAILED'))
    return
  }
  yield put(actions.object.delete.success({
    row: action.payload.row,
    rowsetId: layer.getRowsetId(),
    layerId: layer.getId()
  }))
  toastSuccess(i18n('ROW_DELETED_SUCCESSFULLY'))
}

function* rowUnplacedRequested() {
  const rowSelection = yield select((store: Store) => store.viewLayers.rowSelection)
  if (!rowSelection) return

  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(rowSelection.layerId))
  const rowsetStore: RowsetStore = yield select((store: Store) => store.rowsetStore)

  const row = rowsetStore.getRow(layer.getRowsetId(), rowSelection.rowId)
  yield put(actions.object.unplaced({
    position: new PositionEncoding({}),
    layerId: layer.getId(),
    data: layer.getData(),
    rowsetId: layer.getRowsetId(),
    row: row as Row,
    rowCoordinates: new RowCoordinates({})
  }))
}

function* notifyRowSaveSuccess() {
  yield delay(2000, true)
  window.postMessage({ type: 'rowSaveSuccess' }, '*')
}

function* saveRotation(action: ReturnType<typeof actions.image.rotateRequested>) {
  const rowset: Rowset = yield select((store: Store) => store.rowsetStore.getRowset(action.payload.rowsetId))
  const query = yield select((store: Store) => store.queryStore.queries.findQuery(rowset.getPositionData()?.getQueryKey()))
  const row = rowset.rows.getById(action.payload.rowId)!
  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(action.payload.layerId))
  const viewField = layer.encoding.image!.view!.field!

  yield put(actions.rowset.rowFieldsSaveRequested({
    query,
    row,
    rowsetId: action.payload.rowsetId,
    updateRowData: {
      [viewField]: action.payload.view
    }
  }))
}

export const rowSagas = () => [
  takeBufferedLeadingPerKey(actions.rowset.rowFieldsSaveRequested, saveRow, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.rowset.rowPositionSaveRequested, saveRow, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.object.fieldsUpdated, saveFields, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.object.zIndexUpdated, saveFields, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.object.appearanceUpdated, saveFields, (action) => action.payload.row._id + action.payload.type),
  takeBufferedLeadingPerKey(actions.object.placed, savePosition, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.object.unplaced, savePosition, (action) => action.payload.row._id),
  takeBufferedLeadingPerKey(actions.viewLayer.dragEnded, savePosition, (action) => action.payload.row._id),
  takeEvery(actions.object.unplaceRequest, rowUnplacedRequested),
  takeEvery(actions.object.create.request, createRow),
  takeEvery(actions.object.delete.request, deleteRow),
  takeEvery(actions.rowHistory.rowUndoRequested, savePosition),
  takeLatestPerKey(actions.image.boundsCreated, savePosition, (action) => action.payload.row._id),
  takeEvery(actions.rowset.rowSave.success, notifyRowSaveSuccess),
  takeEvery(actions.image.rotateRequested, saveRotation)
]
