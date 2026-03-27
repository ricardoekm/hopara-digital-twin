import { Column } from '../column/Column'
import { Query } from './Query'

test('Has primary key', () => {
  const query = new Query({name: 'name', dataSource: 'ds'})
  expect(query.hasPrimaryKey()).toBeFalsy()

  query.columns.push(new Column({name: 'sensor_id', primaryKey: true}))
  expect(query.hasPrimaryKey()).toBeTruthy()
})
