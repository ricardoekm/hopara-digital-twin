import { Data } from './Data'

 
test('is equal data', () => {
  const data1 = new Data({source: 'any-source', query: 'any-query'})
  const data2 = new Data({source: 'any-source-2', query: 'any-query'})
  const data3 = new Data({source: 'any-source', query: 'any-query-2'})

  expect(data1.isEqual(data1)).toBeTruthy()
  expect(data1.isEqual(data2)).toBeFalsy()
  expect(data1.isEqual(data3)).toBeFalsy()
})

test('internal prefix query with _', () => {
  const data = Data.internal('any-query')
  expect(data.source).toBe('hopara')
  expect(data.query).toBe('_any-query')
})

