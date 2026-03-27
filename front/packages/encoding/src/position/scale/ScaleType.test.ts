import { Column, ColumnType } from '@hopara/dataset'
import { getPositionScaleType, PositionScaleType } from './ScaleType'

test('get scale type from column', () => {
  expect(getPositionScaleType()).toEqual(PositionScaleType.LINEAR)
  expect(getPositionScaleType(new Column({type: ColumnType.STRING, name: 'any-name'}))).toEqual(PositionScaleType.ORDINAL)
  expect(getPositionScaleType(new Column({type: ColumnType.BOOLEAN, name: 'any-name'}))).toEqual(PositionScaleType.ORDINAL)
  expect(getPositionScaleType(new Column({type: ColumnType.DATETIME, name: 'any-name'}))).toEqual(PositionScaleType.TIME)
  expect(getPositionScaleType(new Column({type: ColumnType.INTEGER, name: 'any-name'}))).toEqual(PositionScaleType.LINEAR)
})
