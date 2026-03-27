import { isNil } from 'lodash/fp'
import { Columns } from '../column/Columns'
import { Etag } from './Etag'
import { geti } from './Geti'
import { Row } from './Row'
import { IndexedRows } from './IndexedRows'

export class Rows extends Array<Row> {
  private etag: Etag
  columns: Columns

  constructor(...rows: Record<string, any>[]) {
    if (rows.length && typeof rows[0] === 'number') {
      super(rows[0])
    } else {
      super()
      rows.forEach((row) => super.push(new Row(row)))
    }

    this.etag = new Etag('')
  }

  setColumns(columns: Columns): void {
    this.columns = columns
  }

  static empty() {
    return new Rows()
  }

  getById(id: any): Row | undefined {
    return !isNil(id) ? this.find((row) => row._id == id) : undefined
  }

  deleteById(id) {
    const index = this.indexOf(this.getById(id) as Row)
    this.splice(index, 1)

    this.etag.updateModifier('delete', id)
  }

  filter(
    predicate: (value: Row, index: number, array: Row[]) => boolean,
    thisArg?: any
  ): Rows {
    const rows = new Rows()
    const filtered = super.filter(predicate, thisArg)
    // Don't use spread because of max stack problems
    filtered.forEach((row) => rows.push(row))

    rows.etag = this.etag
    rows.columns = this.columns
    return rows
  }

  map(
    callbackfn: (value: Row, index: number, array: Row[]) => any,
    thisArg?: any
  ): Rows {
    const rows = new Rows()

    const mapped = super.map(callbackfn, thisArg)
    // Don't use spread because of max stack problems
    mapped.forEach((row) => rows.push(row))

    rows.etag = this.etag
    rows.columns = this.columns
    return rows
  }

  getValues(field?: string): any[] {
    const values: any[] = []
    super.forEach((row) => values.push(geti(field, row)))
    return values
  }

  mergeData(row: Row, rowsToMerge?: IndexedRows) {
    if (rowsToMerge) {
      const positionRow = !isNil(row._id) ? rowsToMerge.get(row._id) : undefined
      if (positionRow) {
        return row.merge(positionRow)
      }
    }

    return row
  }

  merge(rowsToMerge: IndexedRows): Rows {
    let mergedRows = new Rows()

    for (let i = 0; i < this.length; i++) {
      mergedRows.push(this.mergeData(this[i], rowsToMerge))
    }

    mergedRows = mergedRows.filter((row) => !!row)
    mergedRows.etag = this.etag.clone()
    mergedRows.updateEtagModifier('merge', rowsToMerge.getEtagValue())
    mergedRows.columns = new Columns(...this.columns)

    return mergedRows
  }

  sortByColumn(columnName: string, descending = false): Rows {
    const sortedRows = this.clone()
    return sortedRows.sort((a, b) => {
      const aValue = geti(columnName, a)
      const bValue = geti(columnName, b)

      if (aValue == bValue) return 0
      if (isNil(aValue)) return 1
      if (isNil(bValue)) return -1

      if (aValue < bValue) return descending ? 1 : -1
      if (aValue > bValue) return 1

      return 0
    })
  }

  setEtag(etag: Etag) {
    this.etag = etag
  }

  getEtag() {
    return this.etag
  }

  getEtagValue() {
    return this.etag.getValue()
  }

  setEtagValue(value: string) {
    this.etag = new Etag(value)
  }

  updateEtagModifier(key: string, value: any) {
    this.etag.updateModifier(key, value)
  }

  clone(): Rows {
    const rows = new Rows()
    this.forEach((row) => rows.push(row.clone()))
    rows.etag = this.etag.clone()
    rows.columns = this.columns
    return rows
  }

  reverseOrder(): Rows {
    const rows = new Rows()
    for (let i = this.length - 1; i >= 0; i--) {
      rows.push(this[i])
    }
    rows.etag = this.etag
    rows.columns = this.columns
    return rows
  }

  add(row: Row) {
    this.unshift(row)
    this.etag.updateModifier('add', row._id)
  }

  limit(limit: number) {
    if (this.length <= limit) return this

    const rows = new Rows()
    for (let i = 0; i < limit; i++) {
      rows.push(this[i])
    }
    rows.etag = this.etag
    rows.columns = this.columns
    return rows
  }
}
