 
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Exclude} from 'class-transformer'
import { Transform } from '../transform/Transform'
import { QueryKey } from '@hopara/dataset/src/query/Queries'
import {INTERNAL_DATA_SOURCE} from '@hopara/dataset'

export class Data {
  source: string
  query: string
  transform: Transform

  constructor(props?: Partial<Data>) {
    Object.assign(this, props)
  }

  isEqual(data:Data): boolean {
    if (!data) {
      return false
    }

    return data.source === this.source &&
           data.query === this.query
  }

  getBaseQueryKey() : QueryKey {
    return { source: this.source, query: this.query }
  }

  getQueryKey() : QueryKey {
    if (this.transform) {
      return { source: this.source, query: this.query, transform: this.transform.type }
    }

    return this.getBaseQueryKey()
  }

  isInternal(): boolean {
    return this.source === INTERNAL_DATA_SOURCE
  }

  static internal(queryName:string) {
    return new Data({
      source: INTERNAL_DATA_SOURCE,
      query: '_' + queryName,
    })
  }
}
