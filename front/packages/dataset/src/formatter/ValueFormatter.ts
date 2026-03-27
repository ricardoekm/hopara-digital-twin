
import {ColumnType} from '../column/ColumnType'
import {BooleanFormatter} from './BooleanFormater'
import {D3Formatter} from './D3Formatter'
import {DateFormatter} from './DateFormatter'
import {StringArrayFormatter} from './StringArrayFormatter'
import {isNil} from 'lodash/fp'
import { JSONFromater } from './JSONFormatter'
import { IntegerFormatter } from './IntegerFormatter'

export class ValueFormatter {
  format(value:any): any {
    return value
  }
}

export const getFormatter = (columnType?: ColumnType): ValueFormatter => {
  switch (columnType) {
    case ColumnType.DECIMAL:
      return new D3Formatter(columnType)
    case ColumnType.DATETIME:
      return new DateFormatter()
    case ColumnType.STRING_ARRAY:
      return new StringArrayFormatter()
    case ColumnType.BOOLEAN:
      return new BooleanFormatter()
    case ColumnType.INTEGER:
      return new IntegerFormatter()
    case ColumnType.JSON:
    case ColumnType.GEOMETRY:
        return new JSONFromater()
    default:
      return new ValueFormatter()
  }
}

export const formatValue = (value:any, columnType?:ColumnType) => {
  if (isNil(value)) {
    return ''
  }

  const formatter = getFormatter(columnType)
  return formatter.format(value)
}
