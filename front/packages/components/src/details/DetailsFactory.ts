import { Columns} from '@hopara/dataset'
import {DetailsField} from './DetailsField'

export function createDetailsFromColumns(columns: Columns, rowColumnNames: string[] = []): DetailsField[] {
  if (rowColumnNames.length) {
    return rowColumnNames.map((columnName) => {
      const column = columns.get(columnName)
      return column ? DetailsField.fromColumn(column) : undefined
    }).filter((column) => !!column) as DetailsField[]
  }
  return columns.map((column) => DetailsField.fromColumn(column))
}
