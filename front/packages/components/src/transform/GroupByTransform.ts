import { Rows, Columns, ColumnType, Row } from '@hopara/dataset'
import { FrontOnlyTransform } from './FrontOnlyTransform'
import { RowProcessingTransform } from './RowProcessingTransform'
import { TransformType } from '@hopara/encoding'
import { first, groupBy } from 'lodash/fp'

export class GroupByTransform extends FrontOnlyTransform implements RowProcessingTransform {
  fields: string[]

  constructor(fields?: string[]) {
    super()
    this.type = TransformType.groupBy
    this.fields = fields ?? []
  }

  getIndex(row) {
    return this.fields.reduce((result, field) =>
      result + row.getValue(field)
    , '')
  }

  aggregate(rows: Row[], columns: Columns) : Row {
    const aggregatedRow = rows.reduce((result, row) => {
      columns.forEach((column) => {
        if (!(column.isQuantitative() || column.isType(ColumnType.BOOLEAN))) return
        const name = column.getName()
        const aggregatedPreffix = 'max_'
        if (name.startsWith(aggregatedPreffix)) {
          return
        }
        
        const accumulatedColumnName = aggregatedPreffix + column.getName()
        result[accumulatedColumnName] = result[accumulatedColumnName] > row.getValue(name) ? result[accumulatedColumnName] : row.getValue(name) 
      })

      return result
    }, {})

    // The group by field will the same for all rows in the same group
    const referenceRow = first(rows) as Row
    for (const field of this.fields) {
      aggregatedRow[field] = referenceRow[field]
    }

    const row = new Row(aggregatedRow)
    if (referenceRow.isPlaced()) {
      return row.updateCoordinates(referenceRow.getCoordinates())
    }
    
    return row
  }

  apply(rows: Rows, columns: Columns): Rows {
    const groupedRows = groupBy(this.getIndex.bind(this), rows)
    const aggregatedRows = Object.values(groupedRows).map((rows) => this.aggregate(rows, columns))
    return new Rows(...aggregatedRows)
  }

  getParams(): Object {
    return {}
  }
}

