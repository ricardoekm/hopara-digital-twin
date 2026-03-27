import { Column, ColumnType, Columns, DatasetFilters } from '@hopara/dataset'
import { Rowset } from '../rowset/Rowset'
import { getFilters, getPositionFilters, getSelectedFilters } from './DatasetFiltersFactory'
import { SelectedFilters } from './domain/SelectedFilters'
import { Data, PositionEncoding } from '@hopara/encoding'
import { Box, Range } from '@hopara/spatial'
import { SelectedFilter } from './domain/SelectedFilter'
import { Floor } from '../floor/Floor'
import { ComparisonType } from '@hopara/dataset/src/filter/DatasetFilter'

describe('Position Filters', () => {
  it('should create empty position filters', () => {
    const rowset = new Rowset()
    const columns = new Columns()
    const currentFloor = undefined
    const fetchBox = undefined

    const positionFilters = getPositionFilters(rowset.getPositionEncoding(), columns, currentFloor, fetchBox)
    expect(positionFilters).toEqual([])
  })

  it('should create basic position filters', () => {
    const rowset = new Rowset({
      positionData: new Data({source: 'source', query: 'query'}),
      positionEncoding: new PositionEncoding({x: {field: 'x'}, y: {field: 'y'}, floor: {field: 'floor'}}),
    })
    const columns = new Columns(
      new Column({name: 'x', type: ColumnType.INTEGER}),
      new Column({name: 'y', type: ColumnType.INTEGER}),
    )
    const currentFloor = new Floor({name: '2'})
    const fetchBox = new Box({x: new Range({min: 0, max: 1}), y: new Range({min: 0, max: 1})})

    const positionFilters = getPositionFilters(rowset.getPositionEncoding(), columns, currentFloor, fetchBox)
    expect(positionFilters).toEqual([
      {column: 'x', comparisonType: ComparisonType.INTERSECTS, values: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]},
      {column: 'y', comparisonType: ComparisonType.INTERSECTS, values: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]},
      {column: 'floor', comparisonType: ComparisonType.EQUALS, values: ['2', null]},
    ])
  })

  it('should bypass if has no fetch box', () => {
    const rowset = new Rowset({
      positionData: new Data({source: 'source', query: 'query'}),
      positionEncoding: new PositionEncoding({x: {field: 'x'}, y: {field: 'y'}}),
    })
    const columns = new Columns(
      new Column({name: 'x', type: ColumnType.INTEGER}),
      new Column({name: 'y', type: ColumnType.INTEGER}),
    )
    const currentFloor = undefined

    const positionFilters = getPositionFilters(rowset.getPositionEncoding(), columns, currentFloor, undefined)
    expect(positionFilters).toEqual([])
  })
})

describe('Selected Filters', () => {
  it('should create empty selected filters', () => {
    const stateSelectedFilters = new SelectedFilters()
    const columns = new Columns()

    const selectedFilters = getSelectedFilters(stateSelectedFilters, columns)
    expect(selectedFilters).toEqual([])
  })

  it('should create selected filters', () => {
    const stateSelectedFilters = new SelectedFilters(
      new SelectedFilter({field: 'x', values: [1]}),
      new SelectedFilter({field: 'y', values: [1]}), // should be ignored because column does not exist
      new SelectedFilter({field: 'timestamp', values: [1]}),
    )
    const columns = new Columns(
      new Column({name: 'x', type: ColumnType.INTEGER}),
      new Column({name: 'timestamp', type: ColumnType.DATETIME}),
    )

    const selectedFilters = getSelectedFilters(stateSelectedFilters, columns)
    expect(selectedFilters).toEqual([
      {column: 'x', comparisonType: ComparisonType.EQUALS, values: [1]},
      {column: 'timestamp', comparisonType: ComparisonType.GREATER_EQUALS_THAN, values: [1]},
    ])
  })
})

describe('FilterSet', () => {
  it('should create filters', () => {
    const rowset = new Rowset({
      positionData: new Data({source: 'source', query: 'query'}),
      positionEncoding: new PositionEncoding({x: {field: 'x'}, y: {field: 'y'}}),
    })
    const stateSelectedFilters = new SelectedFilters(
      new SelectedFilter({field: 'any-filter', values: [1]}),
      new SelectedFilter({field: 'any-filter-to-be-removed', values: [1]}),
      new SelectedFilter({field: 'timestamp', values: [1]}),
    )
    const columns = new Columns(
      new Column({name: 'x', type: ColumnType.INTEGER}),
      new Column({name: 'y', type: ColumnType.INTEGER}),
      new Column({name: 'any-filter', type: ColumnType.INTEGER}),
      new Column({name: 'timestamp', type: ColumnType.DATETIME}),
    )
    const fetchBox = new Box({x: new Range({min: 0, max: 1}), y: new Range({min: 0, max: 1})})

    const filters = getFilters(stateSelectedFilters, rowset.getPositionEncoding(), columns, undefined, fetchBox)
    expect(filters).toEqual(new DatasetFilters(
      {column: 'x', comparisonType: ComparisonType.INTERSECTS, values: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]},
      {column: 'y', comparisonType: ComparisonType.INTERSECTS, values: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]},
      {column: 'any-filter', comparisonType: ComparisonType.EQUALS, values: [1]},
      {column: 'timestamp', comparisonType: ComparisonType.GREATER_EQUALS_THAN, values: [1]},
    ))
  })
})
