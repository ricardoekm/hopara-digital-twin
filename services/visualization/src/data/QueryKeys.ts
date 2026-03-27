import uniqWith from 'lodash/fp/uniqWith.js'
import { QueryKey } from './QueryKey.js'
import find from 'lodash/fp/find.js'

function dataComparator(a: QueryKey, b: QueryKey) {
  return a.query === b.query && a.source == b.source && a.transform == b.transform
}

export class QueryKeys extends Array<QueryKey> {
  unique() : QueryKeys {
    return new QueryKeys(...uniqWith(dataComparator, this))
  }

  complete() : QueryKeys {
    return new QueryKeys(...this.filter((key) => key.source && key.query))
  }

  hasQuery(queryKey:QueryKey): boolean {
    if ( queryKey.transform ) {
      return !!find({source: queryKey.source,
                     query: queryKey.query,
                     transform: queryKey.transform}, this)
    } else {
      return !!find({source: queryKey.source,
                     query: queryKey.query}, this)
    }
  }

  add(queryKey:Partial<QueryKey>): void {
    this.push(new QueryKey(queryKey))
  }
}
