import { Row, Rows } from '@hopara/dataset'
import { PaginatedRowset, PaginatedRowsetStatus } from './PaginatedRowset'

export class PaginatedRowsetStore {
  rowsets: { [rowsetId: string]: PaginatedRowset }

  constructor(props?: Partial<PaginatedRowsetStore>) {
    Object.assign(this, props)
    if (!this.rowsets) this.rowsets = {}
  }

  clone(): PaginatedRowsetStore {
    return new PaginatedRowsetStore(this)
  }

  getUpdatedRowset(
    rowsetId: string,
    rowsetInfo: Partial<PaginatedRowset>,
    clean = false
  ): PaginatedRowset {
    if (clean) return new PaginatedRowset({ ...rowsetInfo })
    return new PaginatedRowset({ ...this.getRowset(rowsetId), ...rowsetInfo })
  }

  immutableUpdateRowset(
    rowsetId: string,
    rowsetInfo: Partial<PaginatedRowset>,
    clean?: boolean
  ): PaginatedRowsetStore {
    const cloned = this.clone()
    cloned.rowsets = {
      ...cloned.rowsets,
      [rowsetId]: cloned.getUpdatedRowset(rowsetId, rowsetInfo, clean)
    }
    return cloned
  }

  setRows(
    rowsetId: string,
    rows: Rows,
    limit: number,
    offset: number,
    lastPage: boolean,
    append?: boolean
  ): PaginatedRowsetStore {
    const cloned = this.clone()
    if (!cloned.rowsets[rowsetId]) {
      cloned.rowsets = {
        ...cloned.rowsets,
        [rowsetId]: new PaginatedRowset()
      }
    }

    const paginatedRowset = cloned.getUpdatedRowset(rowsetId, {
      limit,
      offset,
      lastPage
    })
    if (append) {
      cloned.rowsets = {
        ...cloned.rowsets,
        [rowsetId]: paginatedRowset.appendRows(rows)
      }
    } else {
      cloned.rowsets = {
        ...cloned.rowsets,
        [rowsetId]: paginatedRowset.setRows(rows)
      }
    }
    return cloned
  }

  updateRow(rowsetId: string | undefined, row: Row): PaginatedRowsetStore {
    const cloned = this.clone()
    if (!rowsetId || !this.rowsets[rowsetId]) return cloned

    const paginatedRowset = new PaginatedRowset({ ...this.rowsets[rowsetId] })
    cloned.rowsets = {
      ...cloned.rowsets,
      [rowsetId]: paginatedRowset.updateRow(row)
    }
    return cloned
  }

  prependRow(rowsetId: string, row: Row): PaginatedRowsetStore {
    const cloned = this.clone()
    if (!cloned.rowsets[rowsetId]) {
      cloned.rowsets = {
        ...cloned.rowsets,
        [rowsetId]: new PaginatedRowset()
      }
    }

    const paginatedRowset = new PaginatedRowset({ ...cloned.rowsets[rowsetId] })
    cloned.rowsets = {
      ...cloned.rowsets,
      [rowsetId]: paginatedRowset.prependRow(row)
    }
    return cloned
  }

  getRowset(rowsetId: string) {
    return this.rowsets[rowsetId] ?? new PaginatedRowset()
  }

  setStatus(
    rowsetId: string,
    status: PaginatedRowsetStatus
  ): PaginatedRowsetStore {
    return this.immutableUpdateRowset(rowsetId, { status })
  }

  setAllLoading(): PaginatedRowsetStore {
    return new PaginatedRowsetStore({
      rowsets: Object.keys(this.rowsets).reduce((acc, rowsetId) => {
        acc[rowsetId] = this.getUpdatedRowset(rowsetId, {
          status: PaginatedRowsetStatus.LOADING,
          rows: new Rows()
        })
        return acc
      }, {})
    })
  }

  reset(rowsetId: string): PaginatedRowsetStore {
    return this.immutableUpdateRowset(rowsetId, new PaginatedRowset(), true)
  }

  resetOffset(rowsetId: string, limit: number) {
    const cloned = this.clone()
    cloned.rowsets = {
      ...cloned.rowsets,
      [rowsetId]: cloned.getUpdatedRowset(rowsetId, {limit, offset: 0})
    }
    return cloned
  }

  setSearch(rowsetId: string, searchTerm?: string): PaginatedRowsetStore {
    return this.immutableUpdateRowset(rowsetId, { searchTerm, offset: 0 })
  }

  deleteRow(rowsetId: string, row: Row) {
    const cloned = this.clone()
    const paginatedRowset = new PaginatedRowset({ ...this.rowsets[rowsetId] })
    cloned.rowsets = {
      ...cloned.rowsets,
      [rowsetId]: paginatedRowset.deleteRow(row)
    }
    return cloned
  }

  someLoading() {
    return Object.values(this.rowsets).some((rowset) => rowset.isLoading())
  }
}
