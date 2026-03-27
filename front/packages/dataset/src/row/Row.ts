import { isNil, isNumber } from 'lodash/fp'
import { geti } from './Geti'
import { NullRowCoordinates, RowCoordinates } from '@hopara/spatial'

export const Z_INDEX_COLUMN_NAME = 'hopara_z_index'

export class Row implements Record<string, any> {
  [field: string]: any
  _id?: string
  _coordinates?: RowCoordinates

  constructor(values) {
    Object.assign(this, values)
  }

  getId() {
    return this._id
  }

  clone(): Row {
    const _coordinates = this._coordinates ? new RowCoordinates(this._coordinates) : undefined
    return new Row({...this, _coordinates})
  }
  
  getValue(key?:string) {
    return geti(key, this)
  }

  isPlaced() {
    return this.getCoordinates()?.isPlaced()
  }

  updateCoordinates(coordinates:RowCoordinates) {
    return new Row({...this, _coordinates: coordinates})
  }

  deleteCoordinates() {
    const row = new Row({...this})
    delete row._coordinates
    return row
  }

  getCoordinates(): RowCoordinates {
    if (isNil(this._coordinates)) {
      return new NullRowCoordinates()
    }

    return this._coordinates as RowCoordinates
  }

  partialUpdate(updatedFields?: Record<string, any>) {
    if (!updatedFields) return this
    return new Row({...this, ...updatedFields})
  }

  contains(term: string) {
    return Object.values(this).some((value) => 
      (typeof value === 'string' && value.toLowerCase().includes(term.toLowerCase())) ||
      (isNumber(value) && value === Number(term)),
    ) 
  }

  merge(otherRow:Row) {
    return new Row({...otherRow, ...this})
  }
}
