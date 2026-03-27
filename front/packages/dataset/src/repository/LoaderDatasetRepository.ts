import { FilterSet } from '../filter/DatasetFilter'
import { Query } from '../query/Query'
import { Row } from '../row/Row'
import { Rows } from '../row/Rows'
import { GetRowsResponse } from '../service/GetRowsResponse'
import { addIds } from '../service/AddId'
import { DatasetRepository, GetRowsParams } from './DatasetRepository'
import { Authorization } from '@hopara/authorization'
import { isEmpty } from 'lodash'
import MurmurHash3 from 'imurmurhash'
import { Columns } from '../column/Columns'
import { Column } from '../column/Column'
import memoize from 'memoizee'
import { DatasetFilters } from '../filter/DatasetFilters'

 
const generateEtag = (rows: Rows) => new Promise<string>((resolve) => {
  const stringfied = JSON.stringify(rows)
  const etag = new MurmurHash3(stringfied).result()
  resolve(etag)
})

export interface PlainError {
  message: string
  stack: any
}

class LoaderError extends Error {
  context?: any

  constructor(error: PlainError, query: Query) {
    super(error.message)
    this.stack = error.stack
    this.context = { source: 'loader', query: query.toQueryKey() }
  }
}

type Loader = (filterSet: FilterSet) => Promise<any[] | {rows: any[], columns?: any[], error?: PlainError}>

async function doGetRows(loader: Loader, filter: FilterSet, query: Query) {
  const rows = new Rows()

  const loaderResponse = await loader(filter) || []
  if (!Array.isArray(loaderResponse) && loaderResponse.error) throw new LoaderError(loaderResponse.error, query)
  const loaderRows = Array.isArray(loaderResponse) ? loaderResponse : loaderResponse.rows
  const loaderColumns: Column[] = Array.isArray(loaderResponse) ? [] : loaderResponse.columns?.map((column: any) => new Column(column)) ?? []
  loaderRows.forEach((responseRow) => rows.push(new Row(responseRow)))

  const etag = await generateEtag(rows)
  rows.setEtagValue(etag)
  rows.setColumns(new Columns(...[...query.getColumns(), ...loaderColumns]))

  if (query.getColumns().hasPrimaryKey()) {
    addIds(rows, query.getColumns().getPrimaryKey() as any)
  }

  return {
    rows,
    lastPage: true,
  }
}

const memoizedGetRows = memoize(
  doGetRows,
  {
    length: 1, // Using only loader as cache key for now
    maxAge: 1000 * 60, // 1 minute
  },
)

export class LoaderDatasetRepository implements DatasetRepository {
  loader: Loader
  cacheable: boolean
  
  constructor(loader: Loader, cacheable = true) {
    this.loader = loader
    this.cacheable = cacheable
  }

  async getRows(params:GetRowsParams): Promise<GetRowsResponse> {
    if (!this.cacheable) {
      return await doGetRows(this.loader, params.filterSet, params.query)
    }
    return await memoizedGetRows(this.loader, params.filterSet, params.query)
  }

  async getRow(rowId:string, query: Query, filters: DatasetFilters, authorization: Authorization): Promise<Row | undefined> {
    const response = await this.getRows({query, filterSet: {filters}, authorization})
    return response?.rows?.getById(rowId)
  }

  async search(query: Query, term: string | undefined, filter: FilterSet, authorization: Authorization) : Promise<GetRowsResponse> {
    const response = await this.getRows({query, filterSet: filter, authorization})
    if (!term || isEmpty(response.rows)) {
      return {
        rows: response.rows,
        lastPage: true,
      }
    }

    return { 
      rows: response?.rows?.filter((row) => row.contains(term)),
      lastPage: true,
    }
  }
}
