import { Column } from '../column/Column'
import { FilterSet } from '../filter/DatasetFilter'
import { Query } from '../query/Query'
import { PlainError } from '../repository/LoaderDatasetRepository'

export type LoaderResponse = {
  rows: any[]
  columns?: Pick<Column, keyof Column>[]
  error?: PlainError
}

// We use the plain version on embedded props
export interface PlainDataLoader {
  query: string
  source: string
  cache?: boolean
  loader: (filterSet: FilterSet) => Promise<LoaderResponse>
}

export class DataLoader implements PlainDataLoader {
  query: string
  source: string
  cache: boolean
  loader: (filterSet: FilterSet) => Promise<LoaderResponse>

  constructor(props: Partial<DataLoader>) {
    Object.assign(this, props)
    if (this.cache === undefined) this.cache = true
  }

  isFromQuery(query: Query): boolean {
    return this.query.toLowerCase() === query.name.toLowerCase() &&
           this.source.toLowerCase() === query.dataSource.toLowerCase()
  }
}
