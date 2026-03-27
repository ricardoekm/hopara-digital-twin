import {createAction} from 'typesafe-actions'
import {ResourceHistory, RowHistory} from './RowHistoryStore'

export const rowHistoryActions = {
  imageUndoRequested: createAction('ROW_HISTORY_IMAGE_UNDO_REQUESTED')<ResourceHistory>(),
  modelUndoRequested: createAction('ROW_HISTORY_MODEL_UNDO_REQUESTED')<ResourceHistory>(),
  rowUndoRequested: createAction('ROW_HISTORY_ROW_UNDO_REQUESTED')<RowHistory>(),
}
