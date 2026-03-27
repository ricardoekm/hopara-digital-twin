import { QueryKey } from './QueryKey.js'
import { QueryKeys } from './QueryKeys.js'

it('unique', () => {
  const queryKeys = new QueryKeys()
  queryKeys.add({source: 'any-source', query: 'any-query'})
  queryKeys.add({source: 'any-source', query: 'any-query'})
  queryKeys.add({source: 'any-source', query: 'other-query'})
  queryKeys.add({source: 'other-source', query: 'other-query'})

  const uniqueQueryKeys = queryKeys.unique()
  expect(uniqueQueryKeys.length).toEqual(3)
})

describe('hasQuery', () => {
  it('should return true if queryKey has query', () => {
    const queryKeys = new QueryKeys()
    queryKeys.add({source: 'any-source', query: 'any-query'})

    const key = new QueryKey({source: 'any-source', query: 'any-query'})
    expect(queryKeys.hasQuery(key)).toBeTruthy()
  })

  it('should return false if queryKey has not query', () => {
    const queryKeys = new QueryKeys()
    queryKeys.add({source: 'any-source', query: 'any-query'})

    const key = new QueryKey({source: 'any-source', query: 'other-query'})
    expect(queryKeys.hasQuery(key)).toBeFalsy()
  })

  it('should return false if queryKey has not query and transform', () => {
    const queryKeys = new QueryKeys()
    queryKeys.add({source: 'any-source', query: 'any-query'})
    const key = new QueryKey({source: 'any-source', query: 'any-query', transform: 'TIME'})
    expect(queryKeys.hasQuery(key)).toBeFalsy()
  })

  it('should return true if queryKey has transform query', () => {
    const transformQueryKeys = new QueryKeys()
    transformQueryKeys.add({source: 'any-source', query: 'any-query', transform: 'TIME'})
    const key = new QueryKey({source: 'any-source', query: 'any-query', transform: 'TIME'})
    expect(transformQueryKeys.hasQuery(key)).toBeTruthy()
  })
})
