import { Columns } from '../column/Columns'
import { Etag } from './Etag'
import { Row } from './Row'
import { Rows } from './Rows'

export class IndexedRows extends Map<string, Row> {
  etag: Etag
  columns: Columns

  get(key: string): Row | undefined {
    return super.get(String(key))
  }

  setEtag(etag: Etag) {
    this.etag = etag
  }

  getEtagValue() {
    return this.etag.getValue()
  }

  /**
   * Merges another IndexedRows into this one.
   * - Overwrites existing rows with the same key.
   * - Combines columns.
   * - Updates ETag to reflect merged state.
   */

  merge(other: IndexedRows): IndexedRows {
    if (!(other instanceof IndexedRows)) {
      throw new Error(
        'Cannot merge: Provided object is not an IndexedRows instance'
      )
    }

    // Merge rows from `other` into this instance
    for (const [key, row] of other.entries()) {
      this.set(key, row) // Overwrites existing row if key exists
    }

    // Merge columns (assuming Columns has a method to merge)
    if (this.columns && other.columns) {
      this.columns = new Columns(...this.columns, ...other.columns)
    }

    // Update ETag to reflect merged data
    this.etag = other.etag || this.etag

    return this
  }
}

export function createIndexedRowsById(rows: Rows): IndexedRows {
  const indexedRows = new IndexedRows()

  for (const row of rows) {
    if (!row._id) continue
    indexedRows.set(String(row._id), row)
  }

  indexedRows.setEtag(rows.getEtag().clone())
  indexedRows.columns = new Columns(...rows.columns)

  return indexedRows
}
