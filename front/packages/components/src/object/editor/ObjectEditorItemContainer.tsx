import {useMemo} from 'react'
import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {ActionProps, ObjectEditorItemComponent, StateProps} from './ObjectEditorItemComponent'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {getTextValue} from '../../details/DetailsLineFactory'
import {createDetailLines} from '../../details/DetailsLineFactory'
import {getRowTitleField} from '../../row/RowService'
import {EntityFactory} from '../EntityFactory'
import {isNil} from 'lodash/fp'
import {getResourceProgressType} from '../../resource/ResourceHistoryComponent'
import {RowSavedStatus} from '../../row/RowHistoryStore'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {LayerType} from '../../layer/LayerType'
import { ResourceUploadStatus } from '../../resource/ResourceStore'

export function mapState(state: Store): StateProps {
  const authorization = state.auth.authorization
  const layers = state.layerStore.layers
  const layer = layers.getById(state.details.layerId)!
  const layerQuery = state.queryStore.queries.findQuery(layer?.getQueryKey())
  const positionQuery = state.queryStore.queries.findQuery(layer?.getPositionQueryKey())
  const hasSelectedObjectType = !isNil(state.objectMenu.selectedId)
  const row = state.details.row
  const {title, titleField, isTitleEditable} = useMemo(() => {
    const rowTitleField = getRowTitleField(layerQuery, layer)
    return {
      title: rowTitleField ? getTextValue(row, layerQuery!.getColumns(), rowTitleField.value.encoding.text) : '',
      titleField: rowTitleField?.getField() ?? '',
      isTitleEditable: !!layerQuery?.canUpdate() && !!layerQuery?.columns.find((column) => column.isEditable),
    }
  }, [layer, row])
  const detailLines = row ? createDetailLines(row, authorization.tenant, layerQuery?.getColumns(), layer?.details, titleField) : []
  const library = layer.encoding?.image?.scope!
  const resourceId = layer.encoding?.image?.getId(row)
  const resourceUpload = state.resource.getUpload(library, resourceId)
  const status = getResourceProgressType(resourceUpload)
  const progress = resourceUpload?.status === ResourceUploadStatus.UPLOADING ? (resourceUpload?.progress ?? 0) * 100 : undefined
  const entities = EntityFactory.create(layers, state.queryStore.queries)
  const layerIsEntity = entities.some((entity) => entity.layer?.getId() === layer?.getId())
  const lastImageVersionDate = state.imageHistory.lastModified
  const lastRowSaved = state.rowHistory.last()

  return {
    title,
    titleField,
    canEditTitle: isTitleEditable,
    isImage: !!layer?.isType(LayerType.image),
    isModel: !!layer?.isType(LayerType.model),
    rowId: row?._id,
    lines: detailLines,
    uploadProgress: progress,
    uploadStatus: status,
    canInsert: !!layerQuery?.canInsert(),
    isRowSaving: state.rowHistory.status === RowSavedStatus.saving && lastRowSaved?.row._id === row?._id,
    layer,
    visualization: state.visualizationStore.visualization,
    row: row!,
    world: state.world!,
    currentFloor: state.floorStore.getCurrent(),
    authorization,
    canBack: layerIsEntity && hasSelectedObjectType,
    canPlace: layer?.canPlace(positionQuery?.canUpdate()),
    cantPlaceReason: layer.cantPlaceReason(positionQuery?.canUpdate()),
    registeredCallbacks: state.action.registeredCallbacks,
    lastImageVersionDate,
    isMobile: state.browser.isMobile(),
    canEditAppearance: layer.canSetObjectAppearance(),
    currentTab: state.objectEditor.itemTabIndex ?? 0,
    isCollapsed: !!state.details.isCollapsed,
  }
}

export function mapActions(dispatch: Dispatch, props: StateProps, navigation: PageNavigation): ActionProps {
  return {
    onActionClick: (action) => {
      dispatch(actions.details.actionClicked({action, layerId: props.layer.getId(), row: props.row, navigation}))
    },
    onBackButtonClick: () => {
      dispatch(actions.details.backClicked({layerId: props.layer.getId()}))
    },
    onDelete: () => {
      dispatch(actions.object.delete.request({
        layerId: props.layer.getId(),
        row: props.row,
        rowsetId: props.layer.getRowsetId(),
      }))
    },
    onPlace: async (placement: any) => {
      if (!props.world) return

      dispatch(actions.object.place.request({
        placement,
        row: props.row,
        rowsetId: props.layer.getRowsetId(),
        layerId: props.layer.getId()!,
      }))
    },
    onTitleChange: (title: string) => {
      dispatch(actions.object.titleChanged({
        layerId: props.layer.getId() as string,
        title,
        row: props.row,
        rowsetId: props.layer.getRowsetId() as string,
      }))
    },
    onCloseButtonClick: () => {
      dispatch(actions.details.closeClicked())
    },
    onClickMobile: () => {
      dispatch(actions.object.placeClickedMobile({
        layerId: props.layer.getId(),
        row: props.row,
        rowsetId: props.layer.getRowsetId(),
      }))
    },
    onTabChange: (tabIndex: number) => {
      dispatch(actions.objectEditor.itemTabChanged({tabIndex}))
    },
    onLockClick: (layerId: string) => {
      dispatch(actions.objectEditor.lockToggleRequested({layerId}))
    },
    onLockOtherLayersClick: (layerId: string) => {
      dispatch(actions.objectEditor.lockOtherLayersRequested({layerId}))
    },
    onUnlockOtherLayersClick: (layerId: string) => {
      dispatch(actions.objectEditor.unlockOtherLayersRequested({layerId}))
    },
  }
}

const shouldRender = (store: Store) => {
  return !!(store.details.layerId && store.details.row) && !!store.layerStore.layers.getById(store.details.layerId)
}

export const ObjectEditorItemContainer = connect(mapState, mapActions, shouldRender)(ObjectEditorItemComponent)
