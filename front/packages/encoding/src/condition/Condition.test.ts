import { Row } from '@hopara/dataset'
import { testCondition } from './Condition'

test('test condition', () => {
  const condition = { test: { field: 'alert' }}
  const result = testCondition(condition, new Row({alert: true}))
  expect(result).toBeTruthy()
})

test('test condition with value', () => {
  const condition = { test: { field: 'alert', value: 0 }}
  const result = testCondition(condition, new Row({alert: 0}))
  expect(result).toBeTruthy()
})

test('test condition is case insensitive', () => {
  const condition = { test: { field: 'ALERT' }}
  const result = testCondition(condition, new Row({alert: true}))
  expect(result).toBeTruthy()
})

test('if field doesnt exists return false', () => {
  const condition = { test: { field: 'bla' }}
  const result = testCondition(condition, new Row({alert: true}))
  expect(result).toBeFalsy()
})

test('reverse condition', () => {
  const condition = { test: { field: 'bla', reverse: true }}
  const result = testCondition(condition, new Row({alert: true}))
  expect(result).toBeTruthy()
})

test('if there is parent condition all conditions must match', () => {
  const condition = { test: { field: 'alert' }, parentTest: { field: 'online'} }
  const result1 = testCondition(condition, new Row({alert: true, online: true}))
  expect(result1).toBeTruthy()

  const result2 = testCondition(condition, new Row({alert: true, online: false}))
  expect(result2).toBeFalsy()
})

