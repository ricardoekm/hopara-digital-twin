import { Data } from '@hopara/encoding'
import {Filter} from './Filter'
import {Filters} from './Filters'

const removeIds = (filters: any[]) => filters.map((filter) => {
  delete filter.id
  return filter
})

test('should return only singleChoice filters', () => {
  const filters = removeIds(new Filters(
    new Filter({field: 'filter1', data: new Data({source: 'hopara', query: 'query1'}), values: ['filter1', 'filter2']}),
    new Filter({field: 'filter2', data: new Data({source: 'hopara', query: 'query2'}), values: ['filter1'], singleChoice: true}),
  ))

  expect(['filter1', 'filter2']).toEqual((filters as Filters).getFieldList())
})

test('get by data', () => {
  const filters = new Filters(
    new Filter({field: 'filter1', data: new Data({source: 'hopara', query: 'query1'})}),
    new Filter({field: 'filter2', data: new Data({source: 'hopara', query: 'query2'})}),
  )

  const returnedFilter = filters.getByData(new Data({source: 'hopara', query: 'query1'}))
  expect(returnedFilter?.field).toEqual('filter1')
})

