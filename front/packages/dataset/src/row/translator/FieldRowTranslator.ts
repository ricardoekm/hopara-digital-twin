import {get} from 'lodash/fp'
import { RowTranslator } from './RowTranslator'

export class FieldRowTranslator implements RowTranslator {
  rows: any[]
  fieldName: string
  path?: string

  constructor(rows:any, fieldName:string, path?: string) {
    this.rows = rows
    this.fieldName = fieldName
    this.path = path
  }

  translate(value:Object) : any {
    return this.rows.find((row) => {
      if (this.path) return get(this.path, row[this.fieldName]) === get(this.path, value)
      return row[this.fieldName] === value
    })
  }
}
