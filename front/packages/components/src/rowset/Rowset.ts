import {findIndex} from 'lodash/fp'
import {Row, Rows} from '@hopara/dataset'
import { Data, PositionEncoding, TransformType } from '@hopara/encoding'
import { QueryKey } from '@hopara/dataset/src/query/Queries'
import { QueryHolder } from '../layer/QueryHolder'
import { RefreshBehavior } from '../layer/RefreshBehavior'
import { FetchState } from './fetch/FetchState'

export class Rowset implements QueryHolder {
  data: Data
  positionData: Data
  rows!: Rows
  fetchState?: FetchState
  positionEncoding: PositionEncoding
  refreshBehavior?: RefreshBehavior

  constructor(props?: Partial<Rowset>) {
    Object.assign(this, props)
    this.rows = props?.rows ?? new Rows()
    this.positionData = props?.positionData ?? props?.data as Data
  }

  clone(): Rowset {
    return new Rowset({
      ...this,
      fetchState: this.fetchState ? this.fetchState.clone() : undefined,
    })
  }

  cleanClone(): Rowset {
    return new Rowset({...this, rows: undefined, fetchState: undefined})
  }

  getFloorField() : string | undefined {
    return this.positionEncoding.floor?.field
  }

  getTransformKey() {
    if (this.data?.transform && this.data.transform.isFrontOnly()) {
      return undefined
    }

    return this.data?.transform?.type
  }

  getPositionId() {
    if (this.positionEncoding) {
      return this.positionEncoding.getId()
    }

    return 'no-pos'
  }

  getPositionEncoding() {
    return this.positionEncoding
  }

  getId() {
    const keys = [
      this.data?.source ?? 'no-source',
      this.data?.query ?? 'no-query',
      this.positionData?.source ?? 'no-position-source',
      this.positionData?.query ?? 'no-position-query',
      this.getTransformKey() ?? 'no-transform',
      this.getPositionId(),
      this.refreshBehavior ?? 'no-refresh',
    ]

    return keys.join('#')
  }

  getScope() {
    return this.positionEncoding?.scope
  }

  updateRow(row:Row): Rowset {
    const index = findIndex({'_id': row._id}, this.rows)
    if (index === -1) {
      return this.addRow(row)
    } else {
      return this.updateRowByIndex(row, index)
    }
  }

  addRow(row:Row) : Rowset {
    const cloned = new Rowset(this)
    const rows = this.rows.clone()
    rows.add(row)
    cloned.rows = rows
    return cloned
  }

  deleteRow(row:Row) : Rowset {
    const cloned = new Rowset(this)
    const rows = this.rows.clone()
    rows.deleteById(row._id)
    cloned.rows = rows
    return cloned
  }

  getRow(rowId:string): Row | undefined {
    return this.rows.getById(rowId)
  }

  updateRowByIndex(row:Row, index:number): Rowset {
    const cloned = new Rowset(this)
    if (this.rows?.length) {
      const clonedRows = this.rows.clone()
      clonedRows.splice(index, 1, row)
      clonedRows.updateEtagModifier('updateByRowIndex', index + Date.now())
      cloned.rows = clonedRows
    }
    return cloned
  }

  getData() : Data {
    return this.data
  }

  getQueryKey() : QueryKey {
    return this.data.getQueryKey()
  }

  getTransformType() : TransformType {
    return this.data.transform?.type
  }

  getPositionData() : Data {
    return this.positionData
  }

  getPositionQueryKey() : QueryKey {
    return this.positionData?.getQueryKey()
  }

  fill(rows:Rows, fetchState:FetchState) {
    const cloned = this.cleanClone()
    cloned.rows = rows
    cloned.fetchState = fetchState
    return cloned
  }
}
