import { fitBounds } from './OrthographicFitBounds'

const anyBounds: [[number, number], [number, number]] = [[0, 50], [30, 100]]

describe('fitBounds', () => {
  it('basic usage', () => {
    const result = fitBounds(anyBounds, 1000, 500)
    expect(result.zoom).toBeCloseTo(3.32)
    expect(result.target[0]).toEqual(15)
    expect(result.target[1]).toEqual(75)
  })

  it('with scaleFactor', () => {
    const result = fitBounds(anyBounds, 1000, 500, 2.25)
    expect(result.zoom).toBeCloseTo(4.49)
    expect(result.target[0]).toEqual(15)
    expect(result.target[1]).toEqual(75)
  })

  it('with max zoom', () => {
    const result = fitBounds(anyBounds, 1000, 500, undefined, 2)
    expect(result.zoom).toEqual(2)
    expect(result.target[0]).toEqual(15)
    expect(result.target[1]).toEqual(75)
  })

  it('with min extent', () => {
    const result = fitBounds(anyBounds, 1000, 500, undefined, undefined, 200)
    expect(result.zoom).toBeCloseTo(1.32)
    expect(result.target[0]).toEqual(15)
    expect(result.target[1]).toEqual(75)
  })

  it('with padding', () => {
    const result = fitBounds(anyBounds, 1000, 500, undefined, undefined, undefined, 100)
    expect(result.zoom).toBeCloseTo(2.58)
    expect(result.target[0]).toEqual(15)
    expect(result.target[1]).toEqual(75)
  })

  it('with offset', () => {
    const result = fitBounds(anyBounds, 1000, 500, undefined, undefined, undefined, undefined, [10, 5])
    expect(result.zoom).toBeCloseTo(3.29)
    expect(result.target[0]).toEqual(25)
    expect(result.target[1]).toEqual(80)
  })
})
