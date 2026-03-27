import {ColorEncoding, ColorFormat} from './ColorEncoding'
import {ColorScaleType} from './scale/ScaleType'
import {Rows} from '@hopara/dataset/src/row/Rows'

const createAnyColorEncoding = (props = {}) => {
  return new ColorEncoding({
    field: 'any-field',
    opacity: 0.5,
    scale: {
      type: ColorScaleType.SORTED,
      reverse: true,
      scheme: 'yellowgreen',
    },
    ...props,
  })
}

describe('ColorEncoding', () => {
  describe('getField', () => {
    const colorEncoding = createAnyColorEncoding()
    expect(colorEncoding.getField()).toStrictEqual('any-field')
  })

  describe('setField', () => {
    const colorEncoding = createAnyColorEncoding()
    colorEncoding.setField('another-field')
    expect(colorEncoding.field).toStrictEqual('another-field')
  })

  describe('getScaleType', () => {
    const colorEncoding = createAnyColorEncoding({scale: { type: ColorScaleType.LINEAR }})
    expect(colorEncoding.getScaleType()).toStrictEqual(ColorScaleType.LINEAR)
  })

  describe('getFallback', () => {
    const colorEncoding = createAnyColorEncoding({value: 'any-fallback'})
    expect(colorEncoding.getFallback()).toStrictEqual('any-fallback')
  })

  const sampleColors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
  ]

  describe('getScale', () => {
    it('should return reversed colors if reverse param is true', () => {
      const rows = new Rows(...sampleColors.map((_, index) => ({'any-field': index + 1})))
      const colorEncoding = createAnyColorEncoding({scale: { reverse: true, scheme: sampleColors}})
      const scale = colorEncoding.getScaleFunction(rows, undefined, ColorFormat.hex)
      const colors = sampleColors.map((_, index) => scale(index + 1))
      expect(colors).toStrictEqual([...sampleColors].reverse())
    })
  })
})

