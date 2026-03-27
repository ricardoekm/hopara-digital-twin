import { RollbackQueriesFactory } from './RollbackQueriesFactory'

test('Returns all position queries', () => {
  const visualization = {
    layers: [{
      data: {
         source: 'my-ds',
         query: 'my-query',
      },
      encoding: {
        position: {
          data: {
            source: 'my-ds',
            query: 'my-query_pos',
          },
        }, 
      }, 
    }],
  } as any

  const queries = RollbackQueriesFactory.getQueries(visualization)
  expect(queries.length).toEqual(1)
  expect(queries[0].queryKey.dataSource).toEqual('my-ds')
  expect(queries[0].queryKey.name).toEqual('my-query_pos')
})

test('For resource layers return scope', () => {
    const visualization = {
      layers: [{
        type: 'image',
        data: {
          source: 'my-ds',
          query: 'my-query',
        },
        encoding: {
          position: {
            data: {
              source: 'my-ds',
              query: 'my-query_pos',
            },
          },
          image: {
            scope: 'my-scope',
          }, 
        }, 
      }],
    } as any
  
    const queries = RollbackQueriesFactory.getQueries(visualization)
    expect(queries.length).toEqual(1)
    expect(queries[0].queryKey.dataSource).toEqual('my-ds')
    expect(queries[0].queryKey.name).toEqual('my-query_pos')
    expect(queries[0].imageScope).toEqual('my-scope')
})

test('Replicates front scope logic', () => {
    const visualization = {
      scope: 'vizscope',
      layers: [{
        type: 'image',
        data: {
          source: 'myds',
          query: 'myquery',
        },
        encoding: {
          position: {
            data: {
              source: 'myds',
              query: 'myquery_pos',
            },
          },
          image: {
          }, 
        }, 
      }],
    } as any
  
    const queries = RollbackQueriesFactory.getQueries(visualization)
    expect(queries.length).toEqual(1)
    expect(queries[0].queryKey.dataSource).toEqual('myds')
    expect(queries[0].queryKey.name).toEqual('myquery_pos')
    expect(queries[0].imageScope).toEqual('myquery-myds-vizscope')
})
