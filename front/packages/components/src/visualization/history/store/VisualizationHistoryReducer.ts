import {VisualizationHistoryStore, HistoryStatus} from './VisualizationHistoryStore'
import actions, {ActionTypes} from '../../../state/Actions'
import {getType} from 'typesafe-actions'
import { Reducer } from '@hopara/state'
import {VisualizationHistory} from '../domain/VisualizationHistory'

export const visualizationHistoryReducer: Reducer<VisualizationHistoryStore, ActionTypes> = (state = new VisualizationHistoryStore(), action): VisualizationHistoryStore => {
  switch (action.type) {
    case getType(actions.visualizationHistory.list.success):
      return state.setHistory(action.payload.history)
    case getType(actions.visualizationHistory.list.request):
      return state.setLoadStatus(HistoryStatus.LOADING)
    case getType(actions.visualizationHistory.list.failure):
      return state.setLoadStatus(HistoryStatus.ERROR)
    case getType(actions.visualizationHistory.checkoutVersion):
      return state.setCurrentVersion(action.payload.version)
    case getType(actions.visualizationHistory.close):
      return state.setHistory(new VisualizationHistory()).setLoadStatus(HistoryStatus.CLOSED)
    case getType(actions.visualization.editorDiscardChangesRequest):
      return state.setCurrentVersion(undefined)
  }
  return state
}
