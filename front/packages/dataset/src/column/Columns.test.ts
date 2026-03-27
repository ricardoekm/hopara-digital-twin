import {Column} from './Column'
import {Columns} from './Columns'
import { ColumnType } from './ColumnType'

describe('Columns', () => {
  test('get', () => {
    const columnA = new Column({name: 'columnA'})
    const columnB = new Column({name: 'columnB'})

    const columns = new Columns()
    columns.push(columnA)
    columns.push(columnB)

    expect(columns.get('columnB')).toStrictEqual(columnB)
  })

  test('get primary key column', () => {
    const columnA = new Column({name: 'columnA', primaryKey: true})
    const columnB = new Column({name: 'columnB'})

    const columns = new Columns()
    columns.push(columnA)
    columns.push(columnB)

    expect(columns.getPrimaryKey()).toStrictEqual(columnA)
  })

  test('pick by column names', () => {
    const columns = new Columns(
      new Column({name: 'columnA', type: ColumnType.INTEGER}),
      new Column({name: 'columnB', type: ColumnType.INTEGER}),
      new Column({name: 'columnC', type: ColumnType.INTEGER}),
    )

    expect(columns.pickByNames(['columnC', 'columnA'])).toEqual(new Columns(
      new Column({name: 'columnC', type: ColumnType.INTEGER}),
      new Column({name: 'columnA', type: ColumnType.INTEGER}),
    ))
  })

  test('dedup column by name', () => {
    const columns = new Columns(
      new Column({name: 'columnA', type: ColumnType.DATETIME}),
      new Column({name: 'columnB', type: ColumnType.INTEGER}),
      new Column({name: 'columnA', type: ColumnType.INTEGER}),
    )

    expect(columns).toHaveLength(2)
    expect(columns[1].type).toBe(ColumnType.INTEGER)
  })

  test('merge columns', () => {
    const columns = new Columns(
      new Column({name: 'columnA', type: ColumnType.DATETIME}),
      new Column({name: 'columnB', type: ColumnType.INTEGER}),
    )

    const columnsToMerge = new Columns(
      new Column({name: 'columnB', type: ColumnType.STRING}),
      new Column({name: 'columnC', type: ColumnType.BOOLEAN}),
    )

    expect(columns.mergeWithKeepingOlds(columnsToMerge)).toEqual(new Columns(
      new Column({name: 'columnA', type: ColumnType.DATETIME}),
      new Column({name: 'columnB', type: ColumnType.INTEGER}),
      new Column({name: 'columnC', type: ColumnType.BOOLEAN}),
    ))
  })
})
