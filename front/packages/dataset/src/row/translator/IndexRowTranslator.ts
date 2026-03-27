import { isNil } from 'lodash/fp'
import { RowTranslator } from './RowTranslator'

export class IndexRowTranslator implements RowTranslator {
  rows: any[]

  constructor(rows:any) {
    this.rows = rows
  }

  translate(value:Object, index?:number) : any {
    if (isNil(index)) {
      return undefined
    }

    return this.rows[index]
  }
}
