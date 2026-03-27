import {getAttributesDeep} from './Extractor.js'

it('get query names', () => {
  const value = {
    any: 'field',
    query: 'query-a',
    obj: {
      any: 'field',
      query: 'query-b',
    },
    arr: [
      {
        any: 'field',
        query: 'query-c',
        nullField: null,
      },
      {
        arr: [
          {
            any: 'field',
            query: 'query-d',
          },
        ],
      },
    ],
  }

  expect(getAttributesDeep(value, 'query')).toEqual(['query-a', 'query-b', 'query-c', 'query-d'])
})
