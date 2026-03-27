import {geti} from './Geti'
import { Row } from './Row'

test('get value is case insensitive', () => {
  const row = {BIRTHdate: '16/07/1986'}
  expect(geti('birthDate', row)).toEqual('16/07/1986')
})

test('Contains string', () => {
  const row = new Row({ name: 'John Doe' })
  expect(row.contains('john')).toBe(true)
  expect(row.contains('bob')).toBe(false)
})

test('Contains number', () => {
  const row = new Row({ age: 10 })
  expect(row.contains('10')).toBe(true)
  expect(row.contains('20')).toBe(false)
})
