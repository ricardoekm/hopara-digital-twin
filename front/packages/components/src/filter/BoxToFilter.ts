import { Column, Columns, DatasetFilter, DatasetFilters } from '@hopara/dataset'
import {Box, Range} from '@hopara/spatial'
import { ComparisonType } from '@hopara/dataset/src/filter/DatasetFilter'

export type PositionFields = {
  x?: string,
  y?: string,
  z?: string,
  coordinates?: string
}

function getFilters(box: Box, range: Range, column: Column) : DatasetFilter[] {
  if (column?.isQuantitative()) {
    return [
      {column: column.name, comparisonType: ComparisonType.GREATER_EQUALS_THAN, values: [range.getMin()]},
      {column: column.name, comparisonType: ComparisonType.LESS_EQUALS_THAN, values: [range.getMax()]},
    ]
  } else {
    return [{column: column.name, comparisonType: ComparisonType.INTERSECTS, values: [box.getPolygon()]}]
  }
}

export function boxToFilters(box:Box|null, fields:PositionFields, columns: Columns) : DatasetFilters {
  const filters = new DatasetFilters()
  if (!box) return filters

  const columnX = fields.x ? columns.get(fields.x) : undefined
  if (columnX) {
    const columnFilters = getFilters(box, box.x, columnX)
    columnFilters.forEach((filter) => filters.push(filter))
  }

  const columnY = fields.y ? columns.get(fields.y) : undefined
  if (columnY) {
    const columnFilters = getFilters(box, box.y, columnY)
    columnFilters.forEach((filter) => filters.push(filter))
  }

  const columnCoordinates = fields.coordinates ? columns.get(fields.coordinates) : undefined
  if (columnCoordinates) {
    const filtersX = getFilters(box, box.x, columnCoordinates)
    const filtersY = getFilters(box, box.y, columnCoordinates)
    filtersX.forEach((filter) => filters.push(filter))
    filtersY.forEach((filter) => filters.push(filter))
  }

  return filters
}
