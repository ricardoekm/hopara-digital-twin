import { OrthographicViewport } from '../view/deck/OrthographicViewport'
import { getInnerBoundsPercentages, getInnerShape, getInnerShapePercentages } from './ImageShape'

describe('ImageShape', () => {
  it('should get inner bounds percentages', () => {
    const percentages = getInnerBoundsPercentages(
      [[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]],
      [[10, 10], [10, 90], [90, 90], [90, 10], [10, 10]],
      undefined,
      new OrthographicViewport({ limitNavigation: false }),
    )

    expect(percentages).toEqual({
      left: 9.999999999999993,
      top: 10,
      right: 10,
      bottom: 10,
    })
  })

  it('should get inner shape from relative coordinates', () => {
    const innerShape = getInnerShape(
      [[0, 0], [0, 90], [90, 90], [90, 0], [0, 0]],
      [[10, 10], [10, 90], [90, 90], [90, 10], [10, 10]],
      undefined,
      new OrthographicViewport({ limitNavigation: false }),
    )

    expect(innerShape).toEqual([
      [9.000000000000007, 81],
      [8.999999999999993, 9.000000000000007],
      [81, 8.999999999999993],
      [81, 81],
      [9.000000000000007, 81],
    ])
  })

  it('should get inner shape percentages', () => {
    const innerShape = getInnerShapePercentages(
      [[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]],
      [[45, 45], [45, 55], [55, 55], [55, 45], [45, 45]],
      new OrthographicViewport({ limitNavigation: false }),
    )

    expect(innerShape).toEqual([
      [45, 55.00000000000001],
      [45, 44.99999999999999],
      [55.00000000000001, 44.99999999999999],
      [55.00000000000001, 55.00000000000001],
      [45, 55.00000000000001],
    ])
  })

  it('should get inner shape percentages 2', () => {
    const innerShape = getInnerShapePercentages(
      [[0, 0], [0, 80], [80, 80], [80, 0], [0, 0]],
      [[36, 36], [36, 44], [44, 44], [44, 36], [36, 36]],
      new OrthographicViewport({ limitNavigation: false }),
    )

    expect(innerShape).toEqual([
      [45, 55.00000000000001],
      [45, 44.99999999999999],
      [55.00000000000001, 44.99999999999999],
      [55.00000000000001, 55.00000000000001],
      [45, 55.00000000000001],
    ])
  })
})
