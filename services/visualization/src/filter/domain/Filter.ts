import {randomUUID} from 'node:crypto'

import {QueryKey} from '../../data/QueryKey.js'
import {Data} from '../../data/domain/spec/Data.js'
import {AutoFill, FilterSpec} from './spec/Filter.js'

class Filter {
  id: string
  field: string
  data: Data
  required?: boolean
  singleChoice?: boolean
  autoFill?: AutoFill

  constructor(props: Partial<FilterSpec>) {
    Object.assign(this, props)
    if (!props.id) {
      this.id = randomUUID()
    }
  }

  getQueryKey(): QueryKey {
    return QueryKey.fromData(this.data)
  }

  static createDraft(): Filter {
    return new Filter({})
  }
}

export default Filter
