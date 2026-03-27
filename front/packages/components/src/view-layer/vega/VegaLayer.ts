import { Query, Rows } from '@hopara/dataset'

export interface VegaLayer {
  name: string
  encoding: any
  mark: string
  data: {
    values: Rows
  },
  lastModified?: Date
  _transform?: any
  query?: Query
}
