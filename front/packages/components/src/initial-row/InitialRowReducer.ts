import { getType } from 'typesafe-actions'
import actions, {ActionTypes} from '../state/Actions'
import { InitialRow } from './InitialRow'
import { Reducer } from '@hopara/state'
import { Row } from '@hopara/dataset'

export interface InitialRowState extends InitialRow {
  row?: Row
}

export const initialRowReducer: Reducer<InitialRowState | undefined, ActionTypes> = (initialRow, action): InitialRowState | undefined => {
  switch (action.type) {
    case getType(actions.visualization.pageLoaded):
      return action.payload.params.initialRow || initialRow
    case getType(actions.hoc.init):
    case getType(actions.hoc.visualizationChanged):
    case getType(actions.hoc.initialRowChanged):
      return action.payload.initialRow || initialRow
    case getType(actions.object.navigateToInitialRow):
      return {
        ...initialRow!,
        row: action.payload.row,
      }
  }
  return initialRow
}
