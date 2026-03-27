import {ColorLiteralAccessor} from './ColorLiteralAccessor'
import {rgbColor, toRGBArray} from '../Colors'
import {ColorEncoding} from '../ColorEncoding'

describe('ColorLiteralAccessor', () => {
  describe('getColor', () => {
    it('should return value if colorEncoding has value', () => {
      const accessor = new ColorLiteralAccessor(new ColorEncoding({
        value: 'blue',
      }))
      expect(accessor.getColor())
        .toEqual(toRGBArray(rgbColor('blue')))
    })

    it('should return translucent value if colorEncoding has value and opacity', () => {
      const accessor = new ColorLiteralAccessor(new ColorEncoding({
        value: 'blue',
        opacity: 0.5,
      }))
      expect(accessor.getColor())
        .toEqual(toRGBArray(rgbColor('blue').copy({opacity: 0.5})))
    })

    it('should return fallback if colorEncoding does not have value nor scheme but has fallback', () => {
      const accessor = new ColorLiteralAccessor(new ColorEncoding({
        value: 'red',
      }))
      expect(accessor.getColor()).toEqual(toRGBArray(rgbColor('red')))
    })

    it('should return fallback if colorEncoding does not have value nor scheme but has fallback and opacity', () => {
      const accessor = new ColorLiteralAccessor(new ColorEncoding({
        value: 'red',
        opacity: 0.5,
      }))
      expect(accessor.getColor()).toEqual(toRGBArray(rgbColor('red').copy({opacity: 0.5})))
    })
  })
})
