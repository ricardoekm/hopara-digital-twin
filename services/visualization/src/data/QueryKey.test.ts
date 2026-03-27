import { QueryKey } from './QueryKey.js'

test('Get key', () => {
  const data = {source: 'source', query: 'query'}
  const queryKey = new QueryKey(data)
  expect(queryKey.getId()).toEqual('source,query')
})

test('Get transform key', () => {  
  const data = {source: 'source', query: 'query'}
  const queryKey = new QueryKey({...data, transform: 'transform'})
  expect(queryKey.getId()).toEqual('source,query,transform')
})

test('Get transform key is case insensitive', () => {  
  const data = {source: 'source', query: 'query'}
  const queryKey = new QueryKey({...data, transform: 'TRANSFORM'})
  expect(queryKey.getId()).toEqual('source,query,transform')
})
