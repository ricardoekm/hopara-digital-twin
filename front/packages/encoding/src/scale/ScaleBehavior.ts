import {ColumnStats, ColumnType, Rows} from '@hopara/dataset'

export type DomainInput = {
  rows?: Rows, 
  columnStats?: ColumnStats,
  columnType?: ColumnType
  fixedDomain?: string[] | number[] | boolean[]
}

export interface ScaleBehavior {
  getScale(range, domainInput: DomainInput);
}
