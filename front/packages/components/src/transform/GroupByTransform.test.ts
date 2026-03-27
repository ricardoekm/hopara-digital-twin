import { Column, ColumnType, Columns, Row, Rows } from '@hopara/dataset'
import { GroupByTransform } from './GroupByTransform'

const columns = new Columns()
columns.push(new Column({name: 'name', type: ColumnType.STRING}))
columns.push(new Column({name: 'alertLevel', type: ColumnType.INTEGER, quantitative: true}))

test('simple group by', () => {
  const row1 = new Row({
    name: 'ALB-350',
    alertLevel: 0,
  })

  const row2 = new Row({
    name: 'ALB-350',
    alertLevel: 1,
  })

  const rows = new Rows(row1, row2)

  const groupByTransform = new GroupByTransform(['name'])
  const transformedRows = groupByTransform.apply(rows, columns)
  expect(transformedRows.length).toEqual(1)
  expect(transformedRows[0]).toEqual(
    { 
      name: 'ALB-350',
      max_alertLevel: 1,
    },
  )
})

test('group by with multiple columns', () => {
  const row1 = new Row({
    name: 'ALB-350',
    group: 'A',
    alertLevel: 0,
  })

  const row2 = new Row({
    name: 'ALB-350',
    group: 'B',
    alertLevel: 1,
  })

  const row3 = new Row({
    name: 'ALB-350',
    group: 'B',
    alertLevel: 2,
  })

  const rows = new Rows(row1, row2, row3)

  const groupByTransform = new GroupByTransform(['name', 'group'])
  const transformedRows = groupByTransform.apply(rows, columns)
  expect(transformedRows.length).toEqual(2)
  expect(transformedRows[0]).toEqual(
    { 
      name: 'ALB-350',
      group: 'A',
      max_alertLevel: 0,
    },
  )

  expect(transformedRows[1]).toEqual(
    { 
      name: 'ALB-350',
      group: 'B',
      max_alertLevel: 2,
    },
  )
})
