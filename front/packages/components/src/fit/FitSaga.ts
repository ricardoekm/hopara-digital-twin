import { takeLatestPerKey } from '@hopara/state'
import actions from '../state/Actions'
import { BackendDatasetRepository, Row } from '@hopara/dataset'
import { FitToImageService } from './FitToImageService'
import { call, put, select } from '@redux-saga/core/effects'
import { Store } from '../state/Store'
import { LayerStore } from '../layer/state/LayerStore'
import { Authorization } from '@hopara/authorization'
import { getRefreshAuthorization } from '../auth/AuthSaga'
import { FilterType, getDatasetFilters } from '../rowset/DatasetFiltersService'
import QueryStore from '../query/QueryStore'
import { PositionNormalizer } from '@hopara/projector'
import { i18n } from '@hopara/i18n'
import { getInnerShape } from '../image/ImageShape'
import { Bounds, RowCoordinates } from '@hopara/spatial'
import { ViewLayerEditingMode } from '../view-layer/ViewLayerStore'
import { ResourceRepository } from '../resource/ResourceRepository'
import { Layer } from '../layer/Layer'
import { OrthographicViewport } from '../view/deck/OrthographicViewport'
import WebMercatorViewport from '../view/deck/WebMercatorViewport'
import { FitToBuildingService } from './FitToBuildingService'
import { LayerType } from '../layer/LayerType'
import { isActionOf } from 'typesafe-actions'
import { ImageRepository } from '../image/ImageRepository'


function fitToShape(
  row: Row,
  referenceRow: Row,
  referenceShape: any[],
  shapeDimensions?: {width: number, height: number},
  viewport?: OrthographicViewport | WebMercatorViewport,
) {
  const targetRatio = shapeDimensions?.width && shapeDimensions.height ? shapeDimensions.width / shapeDimensions.height : undefined
  const projectedShape = getInnerShape(referenceRow.getCoordinates().getGeometryLike(), referenceShape, targetRatio, viewport)
  return row.updateCoordinates(RowCoordinates.fromGeometry(projectedShape))
}

function fitToRow(row: Row, referenceRow: Row) {
  return row.updateCoordinates(referenceRow.getCoordinates())
}

function* getShape(action: ReturnType<
  typeof actions.fit.fitToImage.request |
  typeof actions.fit.fitToRoom.request
>) {
  const queryStore: QueryStore = yield select((store: Store) => store.queryStore)
  const fitToImageService = new FitToImageService(queryStore.queries, queryStore.loaders)
  const authorization: Authorization = yield getRefreshAuthorization()
  const layerStore: LayerStore = yield select((store: Store) => store.layerStore)
  const targetLayer = layerStore.layers.getById(action.payload.layerId)!

  const rowBox = action.payload.row.getCoordinates().toBox()

  const filterMap = {}
  for (const layer of layerStore.layers) {
    filterMap[layer.getId()] = yield getDatasetFilters([FilterType.SELECTED, FilterType.FLOOR, FilterType.BOX], layer, rowBox)
  }

  if (isActionOf(actions.fit.fitToRoom.request, action)) {
    const viewport = yield select((store: Store) => store.viewState?.viewport)
    return yield call(
      fitToImageService.getInnerShape.bind(fitToImageService),
      action.payload.row.getCoordinates().getGeometryLike(),
      viewport,
      layerStore.layers,
      targetLayer,
      filterMap,
      authorization,
    )
  }

  return yield call(
    fitToImageService.getShape.bind(fitToImageService),
    layerStore.layers,
    targetLayer,
    filterMap,
    authorization,
  )
}

export function* fitToImage(action: ReturnType<
  typeof actions.fit.fitToImage.request |
  typeof actions.fit.fitToRoom.request
>) {
  try {
     const imageShape = yield getShape(action)
    if (!imageShape) return yield put(actions.fit.fitToImage.failure({exception: new Error(i18n('NO_IMAGE_FOUND_TO_FIT'))}))

    const layerStore: LayerStore = yield select((store: Store) => store.layerStore)
    const queryStore: QueryStore = yield select((store: Store) => store.queryStore)
    const viewport = yield select((store: Store) => store.viewState?.viewport)
    const layer = layerStore.layers.getById(action.payload.layerId)!
    const query = queryStore.queries.findQuery(layer.getPositionQueryKey())!
    const positionNormalizer = new PositionNormalizer()

    let updatedRow: Row
    if (!imageShape.shape) updatedRow = fitToRow(action.payload.row, imageShape.row) // The image might not be uploaded yet, we'll fit using the raw coordinates
    else updatedRow = fitToShape(action.payload.row, imageShape.row, imageShape.shape, imageShape.dimensions, viewport)

    yield put(actions.rowset.rowPositionSaveRequested({
      query,
      row: updatedRow,
      rowsetId: layer.getRowsetId(),
      updateRowData: positionNormalizer.getPositionValues(updatedRow, layer.getPositionEncoding()!),
      positionEncoding: layer.getPositionEncoding()!,
      layerId: layer.getId(),
    }))
  } catch (e: any) {
    yield put(actions.fit.fitToImage.failure({exception: e}))
  }
}

const getFitGeometry = (geometry: any, row: Row, layer: Layer, viewport: OrthographicViewport | WebMercatorViewport) => {
  if (!layer.isType(LayerType.image)) return geometry.geometry

  const imageBounds = Bounds
    .fromGeometry(row.getCoordinates().getGeometryLike(), {orthographic: viewport instanceof OrthographicViewport})

  const normalizedGeometry = Bounds
    .fromGeometry(geometry.boundingBox, {orthographic: viewport instanceof OrthographicViewport})
    .fixOrientation(imageBounds as any)
    .toPolygon()

  return normalizedGeometry
}

export function* fitToBuilding(action: ReturnType<typeof actions.fit.fitToBuilding.request>) {
  try {
    const layerStore: LayerStore = yield select((store: Store) => store.layerStore)
    const layer = layerStore.layers.getById(action.payload.layerId)!
    const queryStore: QueryStore = yield select((store: Store) => store.queryStore)
    const query = queryStore.queries.findQuery(layer.getPositionQueryKey())!
    const viewport = yield select((store: Store) => store.viewState?.viewport)

    const fitToBuildingService = new FitToBuildingService(new BackendDatasetRepository())
    const authorization: Authorization = yield getRefreshAuthorization()
    const geometry = yield call(fitToBuildingService.getBuildingGeometry.bind(fitToBuildingService), action.payload.row, authorization)
    if (!geometry) {
      return yield put(actions.fit.fitToBuilding.failure({exception: new Error(i18n('NO_BUILDING_FOUND_TO_FIT'))}))
    }

    const fitGeometry = getFitGeometry(geometry, action.payload.row, layer, viewport)
    const updatedRow = action.payload.row.updateCoordinates(RowCoordinates.fromGeometry(fitGeometry))
    const positionNormalizer = new PositionNormalizer()

    yield put(actions.rowset.rowPositionSaveRequested({
      query,
      row: updatedRow,
      rowsetId: layer.getRowsetId(),
      updateRowData: positionNormalizer.getPositionValues(updatedRow, layer.getPositionEncoding()!),
      positionEncoding: layer.getPositionEncoding()!,
      layerId: layer.getId(),
    }))
  } catch (e: any) {
    yield put(actions.fit.fitToBuilding.failure({exception: e}))
  }
}

function* fitToCrop() {
  const rowSelection = yield select((store: Store) => store.viewLayers.rowSelection)
  const layer: Layer = yield select((store: Store) => store.layerStore.layers.getById(rowSelection.layerId)!)
  const isCropping = yield select((store: Store) => store.viewLayers.getEditingMode(layer.type) === ViewLayerEditingMode.CROP)
  if (!isCropping) return

  const row: Row = yield select((store: Store) => store.rowsetStore.getRowset(layer.getRowsetId())?.rows.getById(rowSelection.rowId))

  try {
    const authorization = yield getRefreshAuthorization()
    const imageLibrary = layer.encoding.image?.scope
    const resourceId = layer.encoding.image?.getId(row)
    const viewport = yield select((store: Store) => store.viewState?.viewport)

    const fitGeometry = yield call(ResourceRepository.getShapeBox, resourceId, imageLibrary, authorization)
    const imageMetadata = yield call(ImageRepository.getMetadata as any, resourceId, imageLibrary, authorization)
    const screenGeometry = fitGeometry.map((point: [number, number]) => [point[0], 100 - point[1]]).reverse()

    const geometryRatio = imageMetadata.width && imageMetadata.height ? (imageMetadata.width / imageMetadata.height) : undefined
    const projectedShape = getInnerShape(row.getCoordinates().getGeometryLike(), screenGeometry, geometryRatio, viewport)

    yield put(actions.fit.fitToCrop.success({
      layerId: layer.getId(),
      rowsetId: layer.getRowsetId(),
      row,
      fitBox: projectedShape,
    }))
  } catch (e: any) {
    yield put(actions.fit.fitToCrop.failure({
      exception: e,
      layerId: layer.getId(),
      rowsetId: layer.getRowsetId(),
      row,
      fitBox: row.getCoordinates().getGeometryLike(),
    }))
  }
}

export const fitSagas = () => [
  takeLatestPerKey(actions.fit.fitToImage.request, fitToImage, (action) => action.payload.row._id),
  takeLatestPerKey(actions.fit.fitToBuilding.request, fitToBuilding, (action) => action.payload.row._id),
  takeLatestPerKey(actions.fit.fitToRoom.request, fitToImage, (action) => action.payload.row._id),
  takeLatestPerKey(actions.rowToolbar.onViewLayerEditModeClicked, fitToCrop, (action) => action.payload.mode),
]
