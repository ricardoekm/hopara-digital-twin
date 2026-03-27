import {getDataRange, QuantizeScaleBehavior} from './QuantizeScaleBehavior'

describe('getDataRange', () => {
  it('Get data range', () => {
    const values = [5, 10, 0]
    expect(getDataRange(values)).toEqual([0, 10])
  })

  it('Get data range with null values should return 0,0', () => {
    const values = [null] as any as Array<number>
    expect(getDataRange(values)).toEqual([0, 0])
  })
})

describe('QuantizeBehavior', () => {
  let behavior = new QuantizeScaleBehavior(null as any)
  describe('getScale', () => {
    test('Quantize scale', () => {
      const colors = Array.from(Array(2).keys())
      const domainInput = { fixedDomain: [1, 100] }
      const scale = behavior.getScale(colors, domainInput)
      expect(scale(1)).toEqual(0)
      expect(scale(2)).toEqual(0)
      expect(scale(49)).toEqual(0)
      expect(scale(100)).toEqual(1)
    })
  })

  describe('getDomain', () => {
    it('it should get stats domain when columnStats exists', () => {
      const columnStats = {min: 0, max: 10} as any
      behavior = new QuantizeScaleBehavior('amount')
      expect(behavior.getDomain({columnStats})).toEqual([0, 10])
    })

    it('it should get [] when there is no columnStats', () => {
      behavior = new QuantizeScaleBehavior('amount')
      expect(behavior.getDomain({})).toEqual([])
    })
  })
})

