import { Columns, Rows } from '@hopara/dataset'
import { Transform } from '@hopara/encoding'
import ViewState from '../view-state/ViewState'

export interface RowProcessingTransform extends Transform {
  apply(rows: Rows, columns: Columns, viewState: ViewState) : Rows
}
