import {deepMax, maxBy} from './Max'

describe('maxBy', () => {
  it('should return the max value of array of objects', () => {
    const max = maxBy(
      [{a: 1}, {a: 2}, {a: 3}, {a: 4}],
      'a',
    )
    expect(max).toEqual({a: 4})
  })
})

describe('deepMax', () => {
  it('should return the max value of array of array of numbers', () => {
    const max = deepMax(
      [[1, 2], [3, 4], [5, 6], [7, 8]],
    )
    expect(max).toEqual(8)
  })
})
