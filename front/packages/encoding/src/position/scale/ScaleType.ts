import { Column, ColumnType } from '@hopara/dataset'

export enum PositionScaleType {
  LINEAR = 'linear',
  TIME = 'utc',
  ORDINAL = 'ordinal',
  NULL = 'null',
}

export const getPositionScaleType = (column?:Column): PositionScaleType => {
  if (!column) return PositionScaleType.LINEAR

  switch (column.getType()) {
    case (ColumnType.STRING):
    case (ColumnType.JSON):
    case (ColumnType.STRING_ARRAY):
    case (ColumnType.GEOMETRY):
    case (ColumnType.BOOLEAN):
      return PositionScaleType.ORDINAL
    case (ColumnType.DATETIME):
      return PositionScaleType.TIME
    default:
      return PositionScaleType.LINEAR
  }
}
