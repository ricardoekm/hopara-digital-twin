 
 
import {Type, Transform} from 'class-transformer'
import {Transform as QueryTransform} from './Transform'
import {isNil} from 'lodash/fp'

import 'reflect-metadata'
import {Columns} from '../column/Columns'
import {QueryWriteLevel} from './QueryWriteLevel'
import {Column} from '../column/Column'
import {QueryKey} from './Queries'
import * as Case from 'case'

export class Query {
  name: string
  dataSource: string
  writeLevel: QueryWriteLevel
  smartLoad: boolean

  @Type(() => Column)
  @Transform(({value}) => Array.isArray(value) ? new Columns(...value) : new Columns())
  columns: Columns

  @Type(() => QueryTransform)
  @Transform(({value}) => Array.isArray(value) ? value : [])
  transforms: QueryTransform[]

  annotation?: string

  constructor(query: Partial<Query>) {
    Object.assign(this, query)
    if (!this.columns) this.columns = new Columns()
    if (!this.transforms) this.transforms = []
  }

  clone() {
    const cloned = new Query(this)
    return cloned
  }

  initializeColumns() : void {
    if (isNil(this.columns)) {
      this.columns = new Columns()
    }
  }

  getColumns(transformType?:string): Columns {
    this.initializeColumns()

    const tranform = this.getTransform(transformType)
    if (tranform) {
      return tranform.getColumns()
    }

    return new Columns(...this.columns)
  }

  getTransform(type:string | undefined) : QueryTransform | undefined {
    if (!type || !this.transforms) {
      return undefined
    }

    return this.transforms.find((transform) => transform.type === Case.constant(type))
  }

  getTransformTypes() : string[] {
    return this.transforms ? this.transforms.map((transform) => transform.type) : []
  }

  getDataSource(): string {
      return this.dataSource
  }

  hasPrimaryKey() : boolean {
    return this.columns.hasPrimaryKey()
  }

  getPrimaryKey() : Column | undefined {
    return this.columns.getPrimaryKey()
  }

  canUpdate(): boolean {
    return (this.writeLevel === QueryWriteLevel.INSERT ||
           this.writeLevel === QueryWriteLevel.UPDATE) && this.hasPrimaryKey()
  }

  getName(): string {
      return this.name
  }

  toQueryKey(): QueryKey {
    return {query: this.name, source: this.dataSource}
  }

  canWrite() : boolean {
    return this.writeLevel && this.writeLevel !== QueryWriteLevel.NONE
  }

  canInsert() : boolean {
    return this.writeLevel === QueryWriteLevel.INSERT
  }

  getId() : string {
    return this.dataSource + this.name
  }

  isFunction() : boolean {
    return this.annotation === 'JS_FUNCTION'
  }
}
