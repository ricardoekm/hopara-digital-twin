import { ComparisonType } from './DatasetFilter'
import {DatasetFilters} from './DatasetFilters'

test('dont add duplicate filters', () => {
  const filters = new DatasetFilters()
  filters.push({column: 'geometria', comparisonType: ComparisonType.INTERSECTS, values: ['legal']})
  filters.push({column: 'geometria', comparisonType: ComparisonType.INTERSECTS, values: ['legal']})

  expect(filters.length).toEqual(1)
})
