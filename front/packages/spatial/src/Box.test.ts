import {Box} from './Box'
import {Range} from './Range'

test('verify if point is in box range', () => {
  const box = new Box({
    x: new Range({min: -5, max: 5}),
    y: new Range({min: -5, max: 5}),
  })

  expect(box.isPointInRange({x: 3, y: 3})).toBeTruthy()
})

test('verify if polygon is in box range', () => {
  const box = new Box({
    x: new Range({min: -5, max: 5}),
    y: new Range({min: -5, max: 5}),
  })

  expect(box.isPolygonInRange([[-2, -2], [-2, 2], [2, 2], [2, -2]])).toBeTruthy()
  expect(box.isPolygonInRange([[-6, -2], [-6, 2], [6, 2], [6, -2]])).toBeTruthy()
  expect(box.isPolygonInRange([[-3, -2], [-6, -6]])).toBeTruthy()
  expect(box.isPolygonInRange([[-3, -2]])).toBeTruthy()
})

test('should multiply the box range', () => {
  const box = new Box({
    x: new Range({min: 0, max: 1}),
    y: new Range({min: 0, max: 1}),
  })

  const expected = new Box({
    x: new Range({min: -0.5, max: 1.5}),
    y: new Range({min: -0.5, max: 1.5}),
  })

  expect(box.multiply(2)).toEqual(expected)
})

test('get polygon', () => {
  const box = new Box({
    x: new Range({min: 0, max: 1}),
    y: new Range({min: 0, max: 1}),
  })

  expect(box.getPolygon()).toEqual([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]])
})
