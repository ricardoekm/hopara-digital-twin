import { useMemo } from 'react'
import {StateProps, ActionProps} from '../resource/ResourceHistoryComponent'
import {Store} from '../state/Store'
import actions from '../state/Actions'
import {PositionNormalizer} from '@hopara/projector'
import { connect } from '@hopara/state'
import {Dispatch} from '@reduxjs/toolkit'
import { Layer } from '../layer/Layer'
import { Row } from '@hopara/dataset'
import { Rowset } from '../rowset/Rowset'
import {ImageHistoryComponent} from '../resource/ImageHistoryComponent'
import {createHistoryResourceURL, ResourceType} from '@hopara/resource'
import {createDetailLines} from '../details/DetailsLineFactory'
import { ResourceUploadState, ResourceUploadStatus } from '../resource/ResourceStore'

const getProgressType = (resourceUpload?: ResourceUploadState) => {
  if (!resourceUpload?.status || resourceUpload.status === ResourceUploadStatus.UPLOADED) return
  if (resourceUpload.status === ResourceUploadStatus.UPLOADING && resourceUpload.progress === 1) return 'processing'
  return 'uploading'
}

interface TransitionProps {
  layer: Layer
  row: Row
  rowset: Rowset
}

const mapState = (store: Store): StateProps & TransitionProps => {
  const positionNormalizer = new PositionNormalizer()
  const layer = useMemo(() => store.layerStore.layers.getById(store.imageHistory.layerId), [store.layerStore.layers, store.imageHistory.layerId])!
  const rowset = store.rowsetStore.getRowset(layer.getRowsetId())!
  const row = rowset.getRow(store.imageHistory.rowId!)
  const normalizedRow = positionNormalizer.normalize(row!, layer?.encoding.position)
  const imageEncoding = layer!.encoding.image!
  const library = layer.encoding?.image?.scope!
  const resourceId = layer.encoding?.image?.getId(row)
  const uploadState = store.resource.getUpload(library, resourceId)
  const status = getProgressType(uploadState)
  const progress = uploadState?.status === ResourceUploadStatus.UPLOADING ? (uploadState.progress ?? 0) * 100 : undefined
  const tenant = store.auth.authorization.tenant
  const query = store.queryStore.queries.findQuery(layer?.getQueryKey())
  const detailsRow = store.details.row
  const lines = useMemo(() => detailsRow ? createDetailLines(detailsRow, tenant, query?.getColumns(), layer?.details) : [], [detailsRow, layer])
  const items = useMemo(() => store.imageHistory.items.map((image) => {
    return {
      ...image,
      imageSrc: createHistoryResourceURL({
        id: layer.encoding?.image?.getId(normalizedRow),
        library: imageEncoding.scope,
        tenant: store.auth.authorization.tenant,
        version: image.version,
        resourceType: ResourceType.image,
      }).toString(),
    }
  }), [layer, normalizedRow, store.imageHistory])

  return {
    layer,
    items,
    rowset,
    progress,
    status,
    name: lines[0]?.value,
    row: normalizedRow,
    loading: store.imageHistory.loading,
    currentVersion: store.imageHistory.currentVersion,
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps & TransitionProps): ActionProps => {
  return {
    onClose: () => {
      dispatch(actions.details.imageHistoryCloseClicked())
    },
    onRestoreVersion: (version: number) => {
      dispatch(actions.image.restore.request({
        row: stateProps.row,
        rowsetId: stateProps.rowset.getId(),
        library: stateProps.layer.encoding?.image?.scope!,
        resourceId: stateProps.layer.encoding?.image?.getId(stateProps.row),
        layerId: stateProps.layer.getId(),
        version,
      }))
    },
  }
}

export const ImageHistoryContainer = connect(mapState, mapActions)(ImageHistoryComponent<TransitionProps>)
