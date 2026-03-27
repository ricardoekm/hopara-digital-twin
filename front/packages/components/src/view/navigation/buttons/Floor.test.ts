import { getFloorLevels } from './FloorLevels'
import {Floors} from '../../../floor/Floors'
import {Floor} from '../../../floor/Floor'


test('should get floor steps', () => {
  const anyFloorValues = Floors.fromStringArray(['0', '1', '2', '3', '4', '5', '6'])
  expect(getFloorLevels(new Floor('0'), anyFloorValues).toStringArray()).toEqual(['0', '1', '2'])
  expect(getFloorLevels(new Floor('1'), anyFloorValues).toStringArray()).toEqual(['0', '1', '2'])
  expect(getFloorLevels(new Floor('2'), anyFloorValues).toStringArray()).toEqual(['1', '2', '3'])
  expect(getFloorLevels(new Floor('5'), anyFloorValues).toStringArray()).toEqual(['4', '5', '6'])
  expect(getFloorLevels(new Floor('6'), anyFloorValues).toStringArray()).toEqual(['4', '5', '6'])
})

test('deduplicate floors', () => {
  const floors = Floors.fromStringArray(['0', '0'])
  expect(floors.length).toBe(1)
})

test('Keep original same in acronym if includes /', () => {
  const floor = new Floor('5/7')
  expect(floor.acronym).toBe('5/7')
})
