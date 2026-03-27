import {getDeepValues} from '../get-deep-values'
import {Visualization} from './Visualization'

it('should get uniq filter columns', async () => {
  const visualization = new Visualization({
    filters: [
      {
        field: 'any-field',
        data: {
          source: 'hopara',
          query: 'any-query',
        },
      },
      {
        field: 'any-field-2',
        data: {
          source: 'hopara',
          query: 'any-query',
        },
      },
    ],
  })

  expect(visualization.getUniqueFilterColumns().length).toEqual(2)
})

it('should get deep values', () => {
  const obj = {
    a: 1,
    b: 2,
    c: {
      a: 2,
      b: 3,
      d: [
        {
          b: 4,
        },
        {
          b: 5,
        },
      ],
    },
    e: [
      {
        b: 6,
        c: null,
      },
    ],
  }

  expect(getDeepValues('b', obj)).toEqual([2, 3, 4, 5, 6])
})

it('get unique query keys', async () => {
  const visualization = new Visualization({
    layers: [
      {
        field: 'any-field',
        data: {
          source: 'hopara',
          query: 'any-query',
        },
      },
      {
        field: 'any-field-2',
        data: {
          source: 'hopara',
          query: 'any-query-2',
        },
      },
    ],
  })

  expect(visualization.getQueryKeys()).toEqual([
    {name: 'any-query', dataSource: 'hopara'},
    {name: 'any-query_hopara_pos', dataSource: 'hopara'},
    {name: 'any-query-2', dataSource: 'hopara'},
    {name: 'any-query-2_hopara_pos', dataSource: 'hopara'},
  ])
})

it('get hopara managed query keys', async () => {
    const visualization = new Visualization({
      layers: [
        {
          field: 'any-field',
          data: {
            source: 'hopara',
            query: 'any-query',
          },
        },
      ],
    })
  
    const queryKeys = visualization.getQueryKeys()
    expect(queryKeys).toEqual([
      {name: 'any-query', dataSource: 'hopara'},
      {name: 'any-query_hopara_pos', dataSource: 'hopara'},
    ])
  })
  
  it('if client doesnt generate hopara managed query key', async () => {
    const visualization = new Visualization({
      layers: [
        {
          field: 'any-field',
          data: {
            source: 'hopara',
            query: 'any-query',
          },
          encoding: {
            position: {
                type: 'CLIENT',
            },
          },
        },
      ],
    })
  
    const queryKeys = visualization.getQueryKeys()
    expect(queryKeys).toEqual([
      {name: 'any-query', dataSource: 'hopara'},
    ])
  })
