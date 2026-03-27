import { Row, Rows } from '@hopara/dataset'
import {
  SIZE_MANAGED_FIELD,
  SizeEncoding,
} from './SizeEncoding'

it('should use sizeValues to get scale if sizeValues is defined', () => {
  const size = new SizeEncoding({value: 10})

  const rows = new Rows()

  const row1 = new Row({ amount: 1 })
  expect(size.getSize(row1, rows)).toEqual(10)

  const row2 = new Row({ amount: 1 })
  expect(size.getSize(row2, rows)).toEqual(10)
})

it('should return 15 if range is 10-20 and value is second value', () => {
  const size = new SizeEncoding({scale: {range: [10, 20]}, field: 'amount'})
  const row = new Row({ amount: 700 })
  
  const rows = new Rows()
  rows.push(new Row({ amount: 0 }))
  rows.push(new Row({ amount: 1400 }))

  expect(size.getSize(row, rows)).toEqual(15)
})

it('if managed should return the row value', () => {
  const size = new SizeEncoding({field: SIZE_MANAGED_FIELD, value: 10, project: (v) => v})
  
  expect(size.getSize(new Row({ [SIZE_MANAGED_FIELD]: 50 }), new Rows())).toEqual(50)
  expect(size.getSize(new Row({}), new Rows())).toEqual(10)
})
