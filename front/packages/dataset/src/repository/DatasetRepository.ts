import { Authorization } from '@hopara/authorization'
import { Query } from '../query/Query'
import { TransformParams } from '../query/TransformParams'
import { FilterSet } from '../filter/DatasetFilter'
import { GetRowsResponse } from '../service/GetRowsResponse'
import { DistanceSort } from '../query/DistanceSort'
import { DatasetFilters } from '../filter/DatasetFilters'
import { Row } from '../row/Row'

export type GetRowsParams = {
  query: Query
  transformParams?: TransformParams
  filterSet: FilterSet
  distanceSort?: DistanceSort
  calculateStats?: boolean
  authorization: Authorization
  downloadProgressCallback?: (progress: number) => void
}

export interface DatasetRepository {
  getRow(
    rowId: string,
    query: Query,
    filters: DatasetFilters,
    authorization: Authorization
  ): Promise<Row | undefined>
  getRows(params: GetRowsParams): Promise<GetRowsResponse>
  search(
    query: Query,
    term: string | undefined,
    filter: FilterSet,
    authorization: Authorization
  ): Promise<GetRowsResponse>
}
