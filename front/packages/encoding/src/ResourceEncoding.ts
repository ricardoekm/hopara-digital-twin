import { Row } from '@hopara/dataset'
import { BaseEncoding } from './BaseEncoding'
import { isNil } from 'lodash'

export abstract class ResourceEncoding<T> extends BaseEncoding<T> {
  value?: string
  field?: string
  fallback?: ResourceEncoding<T>

  getValue(row?:Row, encoding?:ResourceEncoding<T>) {
    if (!encoding) { 
      return undefined
    }

    if (row && encoding.field && !isNil(row[encoding.field])) {
      return row[encoding.field].toString()
    }

    return encoding.value
  }

  getId(row?:Row) {
    return this.getValue(row, this)
  }

  isRenderable(): boolean {
    return !!this.value || !!this.field
  }

  getFallback(row:Row) {
    return this.getValue(row, this.fallback)
  }
}
