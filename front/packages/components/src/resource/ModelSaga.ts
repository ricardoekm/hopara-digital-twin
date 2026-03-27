import actions from '../state/Actions'
import {Authorization} from '@hopara/authorization'
import {Store} from '../state/Store'
import {Layers} from '../layer/Layers'
import {toastInfo, toastSuccess} from '@hopara/design-system/src/toast/Toast'
import {i18n} from '@hopara/i18n'
import {createUploadFunctionChannel} from './ResourceSaga'
import {call, put, select, take, takeEvery} from '@redux-saga/core/effects'
import {getRefreshAuthorization} from '../auth/AuthSaga'
import {Layer} from '../layer/Layer'
import {ModelRepository} from './ModelRepository'

function* uploadModelFile(action: ReturnType<typeof actions.model.upload.request>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const layers: Layers = yield select((store: Store): Layers => store.layerStore.layers)

  try {
    yield put(actions.model.uploadProgress({
      layerId: action.payload.layerId,
      resourceId: action.payload.resourceId,
      library: action.payload.library,
      progress: 0,
    }))

    const channel = yield call(createUploadFunctionChannel, ModelRepository.save, action.payload.resourceId, action.payload.library, action.payload.file, authorization)
    while (true) {
      const {progress = 0, err, dimensions, version, success, processing} = yield take(channel)
      if (err) {
        yield put(actions.model.upload.failure({
          reason: i18n('AN_ERROR_OCCURRED_WHILE_UPLOADING_THE_MODEL_FILE'),
          layerId: action.payload.layerId,
          resourceId: action.payload.resourceId,
          library: action.payload.library,
          exception: err,
        }))
        return
      } else if (success) {
        const layer = layers.getById(action.payload.layerId)
        if (!layer) return

        if (processing) toastInfo(i18n('MODEL_UPLOAD_SUCCESSFUL_BUT_STILL_PROCESSING_MESSAGE'))

        yield put(actions.model.upload.success({
          library: action.payload.library,
          resourceId: action.payload.resourceId,
          layerId: action.payload.layerId,
          rowsetId: action.payload.rowsetId,
          row: action.payload.row,
          dimensions,
          version,
          partial: !!processing
        }))

        return
      }
      yield put(actions.model.uploadProgress({
        layerId: action.payload.layerId,
        resourceId: action.payload.resourceId,
        library: action.payload.library,
        progress,
      }))
    }
  } catch (error: any) {
    yield put(actions.model.upload.failure({
      reason: i18n('AN_ERROR_OCCURRED_WHILE_UPLOADING_THE_MODEL_FILE'),
      layerId: action.payload.layerId,
      resourceId: action.payload.resourceId,
      library: action.payload.library,
      exception: error,
    }))
  }
}

function* restoreModel(action: ReturnType<typeof actions.model.restore.request>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const layer: Layer = yield select((store: Store): Layer => store.layerStore.layers.getById(action.payload.layerId)!)
  const library = layer.encoding?.model?.scope!
  const resourceId = layer.encoding?.model?.getId(action.payload.row)!

  const res = yield call(
    ModelRepository.restoreVersion,
    resourceId,
    library,
    action.payload.version!,
    authorization,
  )
  toastSuccess(i18n('MODEL_RESTORED_SUCCESSFULLY'))
  yield put(actions.model.restore.success({
    layerId: action.payload.layerId,
    rowsetId: action.payload.rowsetId,
    row: action.payload.row,
    dimensions: res.data.dimensions,
    resourceId,
    library,
    version: res.data.version,
  }))
}

function* undoModel(action: ReturnType<typeof actions.rowHistory.modelUndoRequested>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const layer: Layer = yield select((store: Store): Layer => store.layerStore.layers.getById(action.payload.layerId)!)
  const library = layer.encoding?.model?.scope!
  const resourceId = layer.encoding?.model?.getId(action.payload.row)

  try {
    const res = yield call(
      ModelRepository.rollback,
      resourceId as string,
      library as string,
      action.payload.version,
      authorization,
    )

    yield put(actions.model.undo.success({
      layerId: action.payload.layerId,
      rowsetId: action.payload.rowsetId,
      row: action.payload.row,
      dimensions: res.data.dimensions,
      resourceId,
      library,
      version: res.data.version,
    }))
  } catch (e: any) {
    yield put(actions.model.undo.failure({exception: e}))
  }
}

function* loadModelHistory(action: ReturnType<
  typeof actions.details.modelHistoryOpenClicked |
  typeof actions.model.upload.success |
  typeof actions.model.restore.success |
  typeof actions.model.undo.success
>) {
  const isHistoryActive: boolean = yield select((store: Store) => !!store.modelHistory.layerId)
  if (!isHistoryActive) return

  try {
    const authorization: Authorization = yield getRefreshAuthorization()
    const items = yield call(ModelRepository.loadHistory, action.payload.resourceId as string, action.payload.library as string, authorization)
    yield put(actions.model.history.success(items))
  } catch (error: any) {
    yield put(actions.model.history.failure({exception: error}))
  }
}

function* checkoutMetadata(action: ReturnType<typeof actions.model.checkout.request>) {
  const authorization: Authorization = yield getRefreshAuthorization()
  const res = yield call(
    ModelRepository.checkoutMetadata,
    action.payload.resourceId as string,
    action.payload.library as string,
    action.payload.version,
    authorization)
  try {
    yield put(actions.model.checkout.success({
      resourceId: action.payload.resourceId,
      library: action.payload.library,
      version: action.payload.version,
      dimensions: res.data,
      rowsetId: action.payload.rowsetId,
      layerId: action.payload.layerId,
      row: action.payload.row,
    }))
  } catch (e: any) {
    yield put(actions.model.checkout.failure({exception: e}))
  }
}

export const modelSagas = () => [
  takeEvery(actions.model.upload.request, uploadModelFile),
  takeEvery(actions.details.modelHistoryOpenClicked, loadModelHistory),
  takeEvery(actions.model.restore.success, loadModelHistory),
  takeEvery(actions.model.undo.success, loadModelHistory),
  takeEvery(actions.model.upload.success, loadModelHistory),
  takeEvery(actions.model.restore.request, restoreModel),
  takeEvery(actions.rowHistory.modelUndoRequested, undoModel),
  takeEvery(actions.model.checkout.request, checkoutMetadata),
]
