import {createAction, createAsyncAction} from 'typesafe-actions'
import {VisualizationHistory} from '../domain/VisualizationHistory'

export const visualizationHistoryActions = {
  checkoutVersion: createAction('CHECKOUT_VISUALIZATION_VERSION_REQUEST')<{
    visualizationId: string,
    version?: number
  }>(),

  list: createAsyncAction(
    'LIST_VISUALIZATION_HISTORY_REQUEST',
    'LIST_VISUALIZATION_HISTORY_SUCCESS',
    'LIST_VISUALIZATION_HISTORY_FAILURE',
  )<{ visualizationId: string }, { history: VisualizationHistory }, { exception: Error }>(),

  open: createAction('VISUALIZATION_HISTORY_OPEN')<void>(),
  close: createAction('VISUALIZATION_HISTORY_CLOSE')<void>(),
}
