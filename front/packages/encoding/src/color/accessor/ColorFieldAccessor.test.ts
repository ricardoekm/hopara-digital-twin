import {ColorEncoding} from '../ColorEncoding'
import {DEFAULT_COLOR_SCHEME, getRgbScheme} from '../Schemes'
import {ColorFieldAccessor} from './ColorFieldAccessor'
import {ColorScaleType} from '../scale/ScaleType'
import {Row, Rows} from '@hopara/dataset'
import {rgbColor, toRGBArray} from '../Colors'

const defaultSchemeColors = getRgbScheme(DEFAULT_COLOR_SCHEME).colors

describe('getColor', () => {
  it('should use default scheme and scale if they are not passed', () => {
    const colorSpec = new ColorEncoding({field: 'amount'})

    const rows = new Rows({amount: 0}, {amount: 100})
    const accessor = new ColorFieldAccessor(colorSpec)
    const color = accessor.getColor(rows, new Row({amount: 0}), null as any)
    expect(color).toEqual(defaultSchemeColors[0])
  })

  it('should use default scheme and scale if they are not passed and return translucent color if opacity is passed', () => {
    const colorSpec = new ColorEncoding({ field: 'amount', opacity: 0.5 })

    const rows = new Rows({amount: 0}, {amount: 100})
    const accessor = new ColorFieldAccessor(colorSpec)
    const color = accessor.getColor(rows, new Row({amount: 0}), null as any)
    const expectedColor = toRGBArray(rgbColor('rgb(212,50,44)').copy({opacity: 0.5}))

    expect(color).toEqual(expectedColor)
  })

  it('should use default scheme if it is not passed', () => {
    const colorSpec = new ColorEncoding({field: 'country'})

    const rows = new Rows({country: 'BR'}, {country: 'US'}, {country: 'JP'})
    const accessor = new ColorFieldAccessor(colorSpec)
    expect(accessor.getColor(rows, new Row({country: 'BR'}))).toEqual(defaultSchemeColors[0])
    expect(accessor.getColor(rows, new Row({country: 'US'}))) .toEqual(defaultSchemeColors[2])
    expect(accessor.getColor(rows, new Row({country: 'JP'}))).toEqual(defaultSchemeColors[1])
  })

  it('should use fallback color if value is not found', () => {
    const colorSpec = new ColorEncoding({field: 'country', value: 'red'})

    const rows = new Rows({country: 'BR'})
    const accessor = new ColorFieldAccessor(colorSpec)
    expect(accessor.getColor(rows, new Row({country: null})))
      . toEqual(toRGBArray(rgbColor('red')))
  })

  it('should use fallback color with translucent if value is not found but opacity is passed', () => {
    const colorSpec = new ColorEncoding({field: 'country', value: 'red', opacity: 0.5})

    const rows = new Rows({country: 'BR'})
    const accessor = new ColorFieldAccessor(colorSpec)
    expect(accessor.getColor(rows, new Row({country: null})))
      .toEqual(toRGBArray(rgbColor('red').copy({opacity: 0.5})))
  })


  it('should return computed color based on scheme, field and scale', () => {
    const colorSpec = new ColorEncoding({
      field: 'amount',
      scale: {
        scheme: 'yelloworangered',
        type: ColorScaleType.GROUPED,
      },
    })

    const rows = new Rows(
      {amount: 100}, {amount: 90}, {amount: 40},
      {amount: 10}, {amount: 120}, {amount: 70},
      {amount: 130}, {amount: 60}, {amount: 20},
      {amount: 88},
    )

    const fieldAccessor = new ColorFieldAccessor(colorSpec)

    const schemeColors = getRgbScheme('yelloworangered').colors
    const columnStats = null as any
    const color1 = fieldAccessor.getColor(rows, new Row({amount: 70}), columnStats)
    expect(color1).toEqual(schemeColors[3])
    const color2 = fieldAccessor.getColor(rows, new Row({amount: 100}), columnStats)
    expect(color2).toEqual(schemeColors[6])
    const color3 = fieldAccessor.getColor(rows, new Row({amount: 120}), columnStats)
    expect(color3).toEqual(schemeColors[7])
  })

  it('should return computed color based on scheme, field, scale and opacity', () => {
    const colorSpec = new ColorEncoding({
      field: 'amount',
      scale: {
        scheme: 'yelloworangered',
        type: ColorScaleType.GROUPED,
      },
      opacity: 0.5,
    })

    const rows = new Rows({amount: 0}, {amount: 1}, {amount: 2})

    const fieldAccessor = new ColorFieldAccessor(colorSpec)

    const translucentYellow = toRGBArray(rgbColor('rgb(254,209,111)').copy({opacity: 0.5}))
    const columnStats = null as any
    expect(fieldAccessor.getColor(rows, new Row({amount: 0}), columnStats))
      .toEqual(translucentYellow)
  })
})
