import { getType } from 'typesafe-actions'
import actions, { ActionTypes } from '../state/Actions'
import { PaginatedRowsetStore } from './PaginatedRowsetStore'
import { PaginatedRowsetStatus } from './PaginatedRowset'
import { PositionNormalizer } from '@hopara/projector'
import { getUnprojectedRow } from '../rowset/RowsetReducer'
import { Reducer } from '@hopara/state'
import { Rowset } from '../rowset/Rowset'
import { Layer } from '../layer/Layer'
import { ObjectFetchTarget } from '../object/state/ObjectListActions'

const positionNormalizer = new PositionNormalizer()

export const paginatedRowsetReducer: Reducer<PaginatedRowsetStore, ActionTypes> = (state = new PaginatedRowsetStore(), action, globalState) => {
  switch (action.type) {
    case getType(actions.objectList.fetch.success): {
      const rowset: Rowset | undefined = globalState.rowsetStore.getRowset(action.payload.rowsetId)
      const rows = positionNormalizer.normalizeRows(action.payload.rows, rowset?.getPositionEncoding())
      return state.setRows(
        action.payload.rowsetId,
        rows,
        action.payload.limit,
        action.payload.offset,
        action.payload.lastPage,
        action.payload.append
      )
    }
    case getType(actions.navigation.searchRequested):
      return state.setAllLoading()
    case getType(actions.objectList.fetch.request):
      return state.setStatus(action.payload.rowsetId, PaginatedRowsetStatus.LOADING)
    case getType(actions.objectList.search): 
      return state.setSearch(action.payload.rowsetId, action.payload.searchTerm)
    case getType(actions.object.create.request):
      return state.setStatus(
        action.payload.rowsetId,
        PaginatedRowsetStatus.ADDING
      )

    case getType(actions.object.create.success):
      // Prepend the new row to the beginning of the list and clear search
      return state
        .prependRow(action.payload.rowsetId, action.payload.row)
        .setSearch(action.payload.rowsetId, undefined)
        .setStatus(action.payload.rowsetId, PaginatedRowsetStatus.UPDATED)

    case getType(actions.object.delete.request):
      return state.setStatus(
        action.payload.rowsetId,
        PaginatedRowsetStatus.DELETING
      )

    case getType(actions.layer.queryChanged): {
      const layer: Layer | undefined = globalState.layerStore.layers?.getById(
        action.payload.id
      )
      return state.reset(layer!.getRowsetId())
    }
    case getType(actions.image.boundsCreated):
    case getType(actions.object.placed):
    case getType(actions.viewLayer.dragEnded):
    case getType(actions.object.unplaced): {
      return state.updateRow(
        action.payload.rowsetId,
        action.payload.row.updateCoordinates(action.payload.rowCoordinates)
      )
    }

    case getType(actions.rowset.rowFieldsSaveRequested): {
      const row = action.payload.row.partialUpdate(action.payload.updateRowData)
      return state.updateRow(action.payload.rowsetId, row)
    }

    case getType(actions.rowHistory.rowUndoRequested):
      return state.updateRow(
        action.payload.rowsetId,
        getUnprojectedRow(action.payload.row, globalState.chart.projector)
      )

    case getType(actions.object.delete.success): {
      return state
        .deleteRow(action.payload.rowsetId, action.payload.row)
        .setStatus(action.payload.rowsetId, PaginatedRowsetStatus.UPDATED)
    }
    default:
      return state
  }
}

export function getPaginatedRowsetReducer(target: ObjectFetchTarget): Reducer<PaginatedRowsetStore, any> {
  return (state = new PaginatedRowsetStore(), action, globalState) => {
    if (action.payload?.target ) {
      if (action.payload.target == target) {
        return paginatedRowsetReducer(state, action, globalState)
      } else {
        return state
      }
    }

    // For actions without target
    if ( action.type.startsWith('NAVIGATION_') ) {
      if ( target === ObjectFetchTarget.SEARCH ) {
        return paginatedRowsetReducer(state, action, globalState)
      } else { 
        return state
      }
    }

    return paginatedRowsetReducer(state, action, globalState)
  }
}
