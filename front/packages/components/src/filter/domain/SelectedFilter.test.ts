import {SelectedFilter} from './SelectedFilter'

test('toggle value', () => {
  const filter = new SelectedFilter({})

  expect([]).toEqual(filter.values)
  const newFilter1 = filter.toggleValue('value1')
  expect(['value1']).toEqual(newFilter1.values)
  const newFilter2 = filter.toggleValue('value2')
  expect(['value1', 'value2']).toEqual(newFilter2.values)
  const newFilter3 = filter.toggleValue('value1')
  expect(['value2']).toEqual(newFilter3.values)
})

test('toggling value on singleChoice always keeps one value', () => {
  const filter = new SelectedFilter({values: []})

  expect([]).toEqual(filter.values)
  const newFilter1 = filter.toggleValue('value1', true)
  expect(['value1']).toEqual(newFilter1.values)
  const newFilter2 = filter.toggleValue('value2', true)
  expect(['value2']).toEqual(newFilter2.values)
})
