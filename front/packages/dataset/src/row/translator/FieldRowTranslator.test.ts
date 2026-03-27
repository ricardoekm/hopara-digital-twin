import { Rows } from '../Rows'
import {FieldRowTranslator} from './FieldRowTranslator'

test('get row index by field', () => {
  const rows = new Rows({date: '16/07/1986'}, {date: '18/07/1986'})
  const rowTranslator = new FieldRowTranslator(rows, 'date')
  expect(rowTranslator.translate('18/07/1986')).toEqual(rows[1])
})

test('get row index by field inside a path', () => {
  const rows = new Rows({date: {info: '16/07/1986'}}, {date: {info: '18/07/1986'}})
  const rowTranslator = new FieldRowTranslator(rows, 'date', 'info')
  expect(rowTranslator.translate({info: '18/07/1986'})).toEqual(rows[1])
})
