import { Rows } from '@hopara/dataset'
import { Condition, testCondition } from '@hopara/encoding/src/condition/Condition'

export function filterVisibleRows(rows:Rows, condition:Condition) {
  return rows.filter((row) => testCondition(condition, row, true))
}

export function filterPlacedRows(rows:Rows) {
  return rows.filter((row) => row.isPlaced())
}
