 
import { Data } from '@hopara/encoding'
import {classToPlain} from 'class-transformer'
import 'reflect-metadata'
import {i18n} from '@hopara/i18n'
import {columnLabel} from '@hopara/dataset/src/column/Column'
import { AutoFill } from './AutoFill'

export enum ComparisonType {
  GREATER_EQUALS_THAN = 'GREATER_EQUALS_THAN',
  LESS_EQUALS_THAN = 'LESS_EQUALS_THAN',
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  INTERSECTS = 'INTERSECTS',
  BETWEEN = 'BETWEEN',
}

export class Filter {
  id: string
  field: string
  data: Data
  singleChoice: boolean  
  autoFill?: AutoFill
  values: any[]
  comparisonType?: ComparisonType

  constructor(props?: Partial<Filter>) {
    Object.assign(this, props)
    this.id = props?.id ?? crypto.randomUUID()
    this.data = new Data(this.data ?? {})
    this.values = this.values ?? []
  }

  getId(): string {
    return this.id
  }

  clone(): Filter {
    return new Filter(this)
  }

  setValues(values: any[]): Filter {
    const cloned = this.clone()
    cloned.values = values
    return cloned
  }

  toPlain(): any {
    return classToPlain(this)
  }

  getTitle(): string {
    return this.field ? i18n('FIELD_FILTER', {field: columnLabel(this.field)}) : i18n('NEW_FILTER')
  }
}
