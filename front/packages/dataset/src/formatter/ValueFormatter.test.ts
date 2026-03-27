import {ColumnType} from '../column/ColumnType'
import {getFormatter} from './ValueFormatter'

it('should format integer value', () => {
  const formatter = getFormatter(ColumnType.INTEGER)
  expect(formatter.format(1234)).toBe('1234')
})

it('should format decimal value', () => {
  const formatter = getFormatter(ColumnType.DECIMAL)
  expect(formatter.format(1.23434534)).toBe('1.23')
})

it('should format string value', () => {
  const formatter = getFormatter(ColumnType.STRING)
  expect(formatter.format('hopara')).toBe('hopara')
})

it('should format string value', () => {
  const formatter = getFormatter(ColumnType.STRING_ARRAY)
  expect(formatter.format(['hopara', 'is', 'cool'])).toBe('hopara, is, cool')
})
/*
it('should format date value', () => {
  const formatter = getFormatter(ColumnType.DATETIME)
  expect(formatter.format(1639699200000)).toBe('2021-12-17 12:00:00 AM')
})*/
