import {Rowset} from './Rowset'
import {Rowsets} from './Rowsets'
import { Data } from '@hopara/encoding'

test('has rowset', () => {
  const rowsets = new Rowsets()

  const rowset = new Rowset({data: new Data({ query: 'query', source: 'ds'})})
  expect(rowsets.hasRowset(rowset.getId())).toBeFalsy()

  rowsets.push(rowset)
  expect(rowsets.hasRowset(rowset.getId())).toBeTruthy()
})
