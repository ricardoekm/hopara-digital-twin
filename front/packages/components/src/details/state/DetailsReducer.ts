import actions, {ActionTypes} from '../../state/Actions'
import {getType} from 'typesafe-actions'
import {Row} from '@hopara/dataset'
import {Store} from '../../state/Store'
import { Reducer } from '@hopara/state'

export class DetailsState {
  row?: Row
  layerId?: string
  isCollapsed?: boolean

  constructor(state?: Partial<DetailsState>) {
    Object.assign(this, {}, state)
    if (this.isCollapsed === undefined) this.isCollapsed = false
  }

  reset(): DetailsState {
    return new DetailsState({isCollapsed: this.isCollapsed})
  }

  setRow(row: Row, layerId: string): DetailsState {
    return new DetailsState({
      row,
      layerId,
      isCollapsed: this.isCollapsed,
    })
  }

  setCollapsed(isCollapsed: boolean): DetailsState {
    return new DetailsState({
      row: this.row,
      layerId: this.layerId,
      isCollapsed,
    })
  }
}

const shouldIgnoreUpdate = (state: DetailsState, actionPayload: any, globalState: Store) => {
  const detailRowsetId = globalState.layerStore.layers.getById(state.layerId)?.getRowsetId()
  return detailRowsetId !== actionPayload.rowsetId || !actionPayload.row
}

export const detailsReducer: Reducer<DetailsState, ActionTypes> = (state = new DetailsState(), action, globalState): DetailsState => {
  switch (action.type) {
    case getType(actions.details.closeClicked):
    case getType(actions.object.typeSelected):
    case getType(actions.object.delete.request):
    case getType(actions.visualization.pageLoaded):
    case getType(actions.details.backClicked):
      return state.reset()
    case getType(actions.object.appearanceUpdated):
    case getType(actions.object.fieldsUpdated):
    case getType(actions.object.zIndexUpdated):
      return state.setRow(action.payload.row.partialUpdate(action.payload.updatedFields), state.layerId!)
    case getType(actions.object.click):
      return state.setRow(new Row({...action.payload.row}), action.payload.layer.getId())
    case getType(actions.details.open):
      return state.setRow(new Row({...action.payload.row}), action.payload.layerId)
    case getType(actions.rowset.rowPositionSaveRequested):
      if (shouldIgnoreUpdate(state, action.payload, globalState)) return state
      return state.setRow(new Row({...action.payload.row}), action.payload.layerId)
    case getType(actions.layer.deleted):
      if (state.layerId === action.payload.id) return state.reset()
      return state
    case getType(actions.details.toggleCollapse):
      return state.setCollapsed(!state.isCollapsed)
    case getType(actions.details.setCollapsed):
      return state.setCollapsed(action.payload)
    default:
      return state
  }
}

