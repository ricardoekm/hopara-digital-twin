import {format as d3Format} from 'd3'
import {ColumnType} from '../column/ColumnType'
import {ValueFormatter} from './ValueFormatter'

export class D3Formatter implements ValueFormatter {
  columnType: ColumnType
  
  constructor(columnType: ColumnType) {
    this.columnType = columnType
  }

  getFormatString(): string | undefined {
    switch (this.columnType) {
      case ColumnType.DECIMAL:
        return ',.2f'
      default:
        return
    }
  }

  format(value: any): string {
    const formatString = this.getFormatString()
    if (!formatString) return value
    return d3Format(formatString)(value)
  }
}
