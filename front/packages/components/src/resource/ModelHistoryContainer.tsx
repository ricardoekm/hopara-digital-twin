import {useMemo} from 'react'
import {ActionProps, getResourceProgressType, StateProps} from './ResourceHistoryComponent'
import {Store} from '../state/Store'
import actions from '../state/Actions'
import {PositionNormalizer} from '@hopara/projector'
import {connect} from '@hopara/state'
import {Dispatch} from '@reduxjs/toolkit'
import {Layer} from '../layer/Layer'
import {Row} from '@hopara/dataset'
import {Rowset} from '../rowset/Rowset'
import {ModelHistoryComponent} from './ModelHistoryComponent'
import {createHistoryResourceURL, ResourceType} from '@hopara/resource'
import {createDetailLines} from '../details/DetailsLineFactory'
import { ResourceUploadStatus } from './ResourceStore'

interface TransitionProps {
  layer: Layer
  row: Row
  rowset: Rowset
}

const mapState = (store: Store): StateProps & TransitionProps => {
  const positionNormalizer = new PositionNormalizer()
  const layer = useMemo(() => store.layerStore.layers.getById(store.modelHistory.layerId), [store.layerStore.layers, store.modelHistory.layerId])!
  const rowset = store.rowsetStore.getRowset(layer.getRowsetId())!
  const row = rowset.getRow(store.modelHistory.rowId!)
  const normalizedRow = positionNormalizer.normalize(row!, layer?.encoding.position)
  const modelEncoding = layer!.encoding.model!
  const library = layer.encoding?.image?.scope!
  const resourceId = layer.encoding?.image?.getId(row)
  const uploadState = store.resource.getUpload(library, resourceId)
  const status = getResourceProgressType(uploadState)
  const progress = uploadState?.status === ResourceUploadStatus.UPLOADING ? (uploadState.progress ?? 0) * 100 : undefined
  const query = store.queryStore.queries.findQuery(layer?.getQueryKey())
  const detailsRow = store.details.row
  const tenant = store.auth.authorization.tenant
  const lines = useMemo(() => detailsRow ? createDetailLines(detailsRow, tenant, query?.getColumns(), layer?.details) : [], [detailsRow, layer])
  const items = useMemo(() => store.modelHistory.items.map((model) => {
    return {
      ...model,
      imageSrc: createHistoryResourceURL({
        id: normalizedRow[modelEncoding.field!],
        library: modelEncoding.scope,
        tenant: store.auth.authorization.tenant,
        version: model.version,
        resourceType: ResourceType.model,
      }).toString(),
    }
  }), [layer, normalizedRow, store.modelHistory])

  return {
    layer,
    items,
    rowset,
    progress,
    status,
    name: lines[0].value,
    row: normalizedRow,
    loading: store.modelHistory.loading,
    currentVersion: store.modelHistory.currentVersion,
  }
}

const mapActions = (dispatch: Dispatch, stateProps: StateProps & TransitionProps): ActionProps => {
  return {
    onClose: () => {
      dispatch(actions.details.modelHistoryCloseClicked())
    },
    onRestoreVersion: (version: number) => {
      dispatch(actions.model.restore.request({
        row: stateProps.row,
        rowsetId: stateProps.rowset.getId(),
        layerId: stateProps.layer.getId(),
        library: stateProps.layer.encoding?.model?.scope!,
        resourceId: stateProps.row[stateProps.layer.encoding?.model?.field ?? ''],
        version,
      }))
    }
  }
}

export const ModelHistoryContainer = connect(mapState, mapActions)(ModelHistoryComponent<TransitionProps>)
