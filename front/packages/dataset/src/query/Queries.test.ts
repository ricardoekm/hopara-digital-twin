import {Query} from './Query'
import {Queries} from './Queries'
import { Column } from '../column/Column'
import { Columns } from '../column/Columns'
import { Transform } from './Transform'

test('Should find query', () => {
  const query = new Query({name: 'name', dataSource: 'ds'})
  const queries = new Queries(query)
  expect(queries.findQuery({query: 'name', source: 'ds'})).toEqual(query)
})

test('Should find query different ds', () => {
  const query = new Query({name: 'name', dataSource: 'ds'})
  const queries = new Queries(query)
  expect(queries.findQuery({query: 'name', source: 'ds2'})).toBeUndefined()
})

test('Get columns', () => {
  const query = new Query({name: 'name', dataSource: 'ds'})
  query.columns = new Columns()
  query.columns.push(new Column({name: 'query-column'}))

  const transform = new Transform()
  transform.type = 'MY_TRANSFORM'
  transform.columns = new Columns()
  transform.columns.push(new Column({name: 'transform-column'}))
  query.transforms = [transform]

  const queries = new Queries(query)
  const fetchedColumns = queries.getColumns({query: 'name', source: 'ds'})
  expect(fetchedColumns[0].name).toEqual('query-column')

  const fetchedTransformColumns = queries.getColumns({query: 'name', source: 'ds', transform: 'my-transform'})
  expect(fetchedTransformColumns[0].name).toEqual('transform-column')
})

test('Should merge two query list', () => {
  const queries1 = new Queries(
    new Query({name: 'name', dataSource: 'ds'}),
    new Query({name: 'name2', dataSource: 'ds'}),
    new Query({name: 'name3', dataSource: 'ds2'}),
  )
  const queries2 = new Queries(
    new Query({name: 'name4', dataSource: 'ds2'}),
    new Query({name: 'name', dataSource: 'ds'}),
    new Query({name: 'name3', dataSource: 'ds2'}),
    new Query({name: 'name5', dataSource: 'ds3'}),
  )

  expect(queries1.unionWith(queries2)).toEqual(new Queries(
    new Query({name: 'name', dataSource: 'ds'}),
    new Query({name: 'name2', dataSource: 'ds'}),
    new Query({name: 'name3', dataSource: 'ds2'}),
    new Query({name: 'name4', dataSource: 'ds2'}),
    new Query({name: 'name5', dataSource: 'ds3'}),
  ))
})
