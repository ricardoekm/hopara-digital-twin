import { unionWith } from 'lodash/fp'
import {Column} from '../column/Column'
import {Columns} from '../column/Columns'
import {Query} from './Query'
import {Transform} from './Transform'

export type QueryKey = {
  query: string,
  source: string
  transform?: string
}

export function queryKeyToArray(key: QueryKey): string[] {
  return [key.query, key.source, key.transform as string]
}

const isQueryEqual = (a: Query, b: Query): boolean => {
  return a.name === b.name && a.dataSource === b.dataSource
}

export const NULL_COLUMNS = new Columns()

export class Queries extends Array<Query> {
  findQuery(key?: QueryKey): Query | undefined {
    if (!key) return
    if (!key.query || !key.source) return
    return this.find((q) => q.getName() === key.query && q.getDataSource() === key.source)
  }

  findEntity(key: QueryKey): Query | Transform | undefined {
    const query = this.findQuery(key)
    if (query && key.transform) {
      return query.getTransform(key.transform)
    }

    return query
  }

  getAllColumns(): Columns {
    const columns = new Columns()
    for (const query of this) {
      columns.push(...query.columns)
    }
    return columns
  }

  getColumns(key: QueryKey): Columns {
    const entity = this.findEntity(key)
    if (entity) {
      return entity.columns
    }

    // To avoid unecessary re-render
    return NULL_COLUMNS
  }

  getColumn(queryKey: QueryKey, columnName: string): Column | undefined {
    return this.getColumns(queryKey).find((column: Column) => column.name === columnName)
  }

  getDataSources(): string[] {
    return this
      .map((query) => query.getDataSource())
      .filter((v, i, a) => a.indexOf(v) === i)
  }

  findFromDataSource(dataSource: string) {
    return this.find((query) => query.dataSource === dataSource)
  }

  upsertQuery(query: Query): Queries {
    const index = this.findIndex((q) => isQueryEqual(q, query))
    if (index === -1) {
      return new Queries(...this, query)
    }

    const queries = [...this]
    queries[index] = query
    return new Queries(...queries)
  }

  unionWith(queries): Queries {
    const mergedQueries = unionWith(isQueryEqual, this, queries)
    return new Queries(...mergedQueries)
  }

  clone() {
    return new Queries(...this)
  }
}
