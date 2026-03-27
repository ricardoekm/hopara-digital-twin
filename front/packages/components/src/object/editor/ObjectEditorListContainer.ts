import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {Row} from '@hopara/dataset'
import {Layer} from '../../layer/Layer'
import {ActionProps, ObjectEditorListComponent, StateProps} from './ObjectEditorListComponent'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {RowSavedStatus} from '../../row/RowHistoryStore'

function mapState(state: Store): StateProps {
  const visualization = state.visualizationStore.visualization
  const selectedMenuItemId = state.objectMenu.selectedId
  const layers = state.layerStore.layers
  const layer = layers.getById(selectedMenuItemId) as Layer
  const positionQuery = state.queryStore.queries.findQuery(layer?.getPositionQueryKey())
  const query = state.queryStore.queries.findQuery(layer?.getQueryKey())
  const lastRowSaved = state.rowHistory.last()
  const status = state.entityObjectListStore.getRowset(layer?.getRowsetId())?.status
  const columns = query?.getColumns()
  const hasOptions = !!state.objectMenu.items.length

  return {
    layer,
    layers,
    columns,
    hasOptions,
    currentFloor: state.floorStore.getCurrent(),
    queries: state.queryStore.queries,
    userCanEditRow: state.auth.authorization.canEditRow(),
    filters: state.filterStore.filters,
    authorization: state.auth.authorization,
    objectRowset: layer ? state.entityObjectListStore.getRowset(layer.getRowsetId()) : undefined,
    visualizationIsChart: visualization?.isChart(),
    isQueryEditable: !!positionQuery?.canUpdate(),
    writeLevelInsert: !!query?.canInsert(),
    rowSavingId: state.rowHistory.status === RowSavedStatus.saving && lastRowSaved ? lastRowSaved.row._id : undefined,
    lastImageVersionDate: state.imageHistory?.lastModified,
    status,
    isMobile: state.browser.isMobile(),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onDragToPlace: async (row: Row, placement: any) => {
      dispatch(actions.object.place.request({
        row,
        placement,
        layerId: props.layer.getId(),
        rowsetId: props.layer.getRowsetId(),
      }))
    },
    onObjectClick: (layerId: string, row: Row) => {
      const layer = props.layers.getById(layerId) as Layer
      dispatch(actions.object.click({layer, row}))
    },

    onLockClick: (layerId: string): void => {
      dispatch(actions.objectEditor.lockToggleRequested({layerId}))
    },

    onLockOtherLayersClick: (layerId: string): void => {
      dispatch(actions.objectEditor.lockOtherLayersRequested({layerId}))
    },

    onUnlockOtherLayersClick: (layerId: string): void => {
      dispatch(actions.objectEditor.unlockOtherLayersRequested({layerId}))
    },

    onPaginate: (rowsetId: string, offset: number): void => {
      dispatch(actions.objectList.paginate({rowsetId, offset}))
    },

    onObjectSearch: (rowsetId: string, term: string) => {
      dispatch(actions.objectList.search({rowsetId, searchTerm: term}))
    },
    onAddRowClick: (layerId: string, rowsetId: string) => {
      dispatch(actions.object.create.request({layerId, rowsetId}))
    },
    onCloseClick: () => {
      dispatch(actions.objectEditor.itemCloseClicked())
    },
    onPlaceClickMobile: (layerId: string, row: Row) => {
      dispatch(actions.object.placeClickedMobile({row, layerId, rowsetId: props.layer.getRowsetId()}))
    },
  }
}

function shouldRender(state: Store) {
  return !!state.visualizationStore.visualization
}

export const ObjectEditorListContainer = connect(mapState, mapActions, shouldRender)(ObjectEditorListComponent)
