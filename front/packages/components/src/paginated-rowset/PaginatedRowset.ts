import { Row, Rows } from '@hopara/dataset'

export enum PaginatedRowsetStatus {
  NONE = 'NONE',
  LOADING = 'LOADING',
  UPDATED = 'UPDATED',
  ADDING = 'ADDING',
  DELETING = 'DELETING',
}

export const PAGINATED_ROWSET_PAGE_SIZE = 20

export class PaginatedRowset {
  rows: Rows
  status: PaginatedRowsetStatus
  limit: number
  offset: number
  lastPage: boolean
  searchTerm?: string

  constructor(props?: Partial<PaginatedRowset>) {
    Object.assign(this, props)
    if (!this.rows) this.rows = new Rows()
    if (!this.status) this.status = PaginatedRowsetStatus.NONE
    if (!this.limit) this.limit = PAGINATED_ROWSET_PAGE_SIZE
    if (!this.offset) this.offset = 0
    if (this.lastPage === undefined) this.lastPage = true
  }

  clone(): PaginatedRowset {
    return new PaginatedRowset(this)
  }

  isLoading(): boolean {
    return this.status === PaginatedRowsetStatus.LOADING
  }

  isDeleting(): boolean {
    return this.status === PaginatedRowsetStatus.DELETING
  }

  isLoaded(): boolean {
    return this.status === PaginatedRowsetStatus.UPDATED
  }

  isInitialState(): boolean {
    return this.status === PaginatedRowsetStatus.NONE
  }

  setRows(rows: Rows): PaginatedRowset {
    const cloned = this.clone()
    cloned.rows = rows
    cloned.status = PaginatedRowsetStatus.UPDATED
    return cloned
  }

  appendRows(rows: Rows): PaginatedRowset {
    const cloned = this.clone()
    cloned.rows.setEtag(rows.getEtag())
    for (let index = 0; index < rows.length; index++) {
      cloned.rows.push(rows[index])
    }
    cloned.status = PaginatedRowsetStatus.UPDATED
    return cloned
  }

  prependRow(row: Row): PaginatedRowset {
    const cloned = this.clone()
    const newRows = cloned.rows.clone()
    newRows.unshift(row)
    newRows.updateEtagModifier('prepend', row._id)
    cloned.rows = newRows
    cloned.status = PaginatedRowsetStatus.UPDATED
    return cloned
  }

  getRow(rowId: string): Row | undefined {
    return this.rows.getById(rowId)
  }

  updateRow(row: Row): PaginatedRowset {
    const cloned = this.clone()
    const rowIndex = cloned.rows.findIndex((r) => r._id === row._id)
    if (rowIndex >= 0) {
      const newRows = cloned.rows.clone()
      newRows.splice(rowIndex, 1, row)
      newRows.updateEtagModifier('update', row._id)
      cloned.rows = newRows
    }
    cloned.status = PaginatedRowsetStatus.UPDATED
    return cloned
  }

  deleteRow(row: Row) {
    const cloned = this.clone()
    const rowIndex = cloned.rows.findIndex((r) => r._id === row._id)
    if (rowIndex >= 0) {
      cloned.rows.splice(rowIndex, 1)
      cloned.rows.updateEtagModifier('delete', row._id)
    }
    cloned.status = PaginatedRowsetStatus.UPDATED
    return cloned
  }

  getPlacedRows(): Rows {
    return this.rows.filter((row) => row.isPlaced())
  }
}
