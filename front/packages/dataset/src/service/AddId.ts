import { Column } from '../column/Column'
import { Row } from '../row/Row'
import { Rows } from '../row/Rows'

export const addId = (row:Row, primaryKeyColumnName?: string) => {
  if (primaryKeyColumnName) {
    row['_id'] = row[primaryKeyColumnName]
  }
}

export const addIds = (rows: Row[] | Rows, primaryKeyColumn: Column) => {
  rows.forEach((row) => {
    addId(row, primaryKeyColumn.name)
  })

  return rows
}
