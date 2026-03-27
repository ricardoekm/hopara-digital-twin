import {getDataDomain, GroupedScaleBehavior} from './GroupedScaleBehavior'

describe('getDataDomain', () => {
  it('Get data domain', () => {
    expect(getDataDomain([0, 10])).toEqual([0, 10])
    expect(getDataDomain([10, 0])).toEqual([0, 10])
    expect(getDataDomain(null as any)).toEqual([])
  })
})

let behavior = new GroupedScaleBehavior(null as any)
describe('getScale', () => {
  it('Get local scale', () => {
    const domainInput = { fixedDomain: [100, 90, 40, 10, 120, 70, 130, 60, 20, 88] }
    const colors = Array.from(Array(9).keys())
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(100)).toEqual(7)
    expect(scale(120)).toEqual(8)
    expect(scale(70)).toEqual(4)
  })

  it('Domain smaller than range', () => {
    const domainInput = { fixedDomain: [0] }
    const colors = Array.from(Array(9).keys())
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(0)).toEqual(0)
  })

  it('Get global scale', () => {
    const colors = Array.from(Array(3).keys())
    const domainInput = { fixedDomain: [0, 10, 20] }
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(0)).toEqual(0)
    expect(scale(10)).toEqual(1)
    expect(scale(20)).toEqual(2)
  })

  it('Get global scale more percentiles than colors', () => {
    const colors = Array.from(Array(3).keys())
    const domainInput = { fixedDomain: [0, 10, 20, 30, 40, 50] }
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(0)).toEqual(0)
    expect(scale(10)).toEqual(0)

    expect(scale(20)).toEqual(1)
    expect(scale(30)).toEqual(1)

    expect(scale(40)).toEqual(2)
    expect(scale(50)).toEqual(2)
  })

  it('Boolean scale returns the first and last color', () => {
    const colors = Array.from(Array(3).keys())
    const domainInput = { fixedDomain: [false, true] }
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(false)).toEqual(0)
    expect(scale(true)).toEqual(2)
  })

  it('Get global scale less percentiles than colors', () => {
    const domainInput = { fixedDomain: [0, 10, 20] }
    const colors = Array.from(Array(6).keys())
    const scale = behavior.getScale(colors, domainInput)

    expect(scale(0)).toEqual(0)
    expect(scale(5)).toEqual(1)
    expect(scale(10)).toEqual(3)
    expect(scale(20)).toEqual(5)
  })
})

describe('getDomain', () => {
  it('it should get stats domain when columnStats exists', () => {
    const columnStats = {percentiles: [0, 10]} as any
    behavior = new GroupedScaleBehavior('amount')
    expect(behavior.getDomain({columnStats})).toEqual([0, 10])
  })

  it('it should get [] when there isnt columnStats', () => {
    behavior = new GroupedScaleBehavior('amount')
    expect(behavior.getDomain({})).toEqual([])
  })
})
