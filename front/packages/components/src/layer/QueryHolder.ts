import { QueryKey } from '@hopara/dataset/src/query/Queries'
import { PositionEncoding } from '@hopara/encoding'

export interface QueryHolder {
  getQueryKey() : QueryKey
  getPositionQueryKey() : QueryKey
  getPositionEncoding() : PositionEncoding | undefined
}
