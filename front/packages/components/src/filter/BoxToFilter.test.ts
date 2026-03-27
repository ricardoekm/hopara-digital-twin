import {Box, Range} from '@hopara/spatial'
import { boxToFilters } from './BoxToFilter'
import { Column, Columns } from '@hopara/dataset'
import { ComparisonType } from '@hopara/dataset/src/filter/DatasetFilter'

test('convert to filter', () => {
  const x = new Range({min: 0, max: 10})
  const y = new Range({min: 5, max: 15})

  const box = new Box({x, y})
  const filters = boxToFilters(box, {x: 'time', y: 'size'}, new Columns(new Column({name: 'time'}), new Column({name: 'size'})))

  expect(filters.length).toEqual(2)
  expect(filters[0].comparisonType).toEqual(ComparisonType.INTERSECTS)
  expect(filters[0].values).toEqual([[[0, 5], [10, 5], [10, 15], [0, 15], [0, 5]]])
  expect(filters[0].column).toEqual('time')

  expect(filters[1].comparisonType).toEqual(ComparisonType.INTERSECTS)
  expect(filters[1].values).toEqual([[[0, 5], [10, 5], [10, 15], [0, 15], [0, 5]]])
  expect(filters[1].column).toEqual('size')
})
