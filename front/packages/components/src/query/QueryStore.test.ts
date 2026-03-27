import { Query } from '@hopara/dataset'
import QueryStore from './QueryStore'

test('Add query', () => {
  const query = new Query({name: 'my-query', dataSource: 'my-source'})
  const queryStore = new QueryStore()
  const newQueryStore = queryStore.addQuery(query)
  expect(newQueryStore.queries).toContain(query)
  expect(queryStore.queries).not.toContain(query)
})
