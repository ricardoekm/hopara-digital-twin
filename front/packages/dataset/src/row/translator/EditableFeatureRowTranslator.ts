import { isNil } from 'lodash/fp'
import { RowTranslator } from './RowTranslator'
import { Rows } from '../Rows'

export class EditableFeatureRowTranslator implements RowTranslator {
  rows: Rows

  constructor(rows: Rows) {
    this.rows = rows
  }

  translate(row) : any {
    return this.rows.find((r) => !isNil(r._id) && r._id === row?.properties?.rowId)
  }
}
