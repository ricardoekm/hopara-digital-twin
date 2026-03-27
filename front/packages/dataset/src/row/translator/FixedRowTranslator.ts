import { Row } from '../Row'
import { RowTranslator } from './RowTranslator'

export class FixedRowTranslator implements RowTranslator {
  row:Row

  constructor(row:Row) {
    this.row = row
  }

  translate() {
    return this.row
  }
}
