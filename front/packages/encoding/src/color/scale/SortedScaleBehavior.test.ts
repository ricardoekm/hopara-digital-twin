import {SortedScaleBehavior} from './SortedScaleBehavior'
import {ColorEncoding, ColorFormat} from '../ColorEncoding'
import {Column, Rows} from '@hopara/dataset'
import {ColorScaleType} from './ScaleType'

let behavior = new SortedScaleBehavior(null as any)
describe('getScale', () => {
  it('should return a scale', () => {
    const domainInput = { fixedDomain: ['a', 'b', 'c'] }
    const colors = Array.from(Array(2).keys())
    const scale = behavior.getScale(colors, domainInput)

    expect(scale('a')).toEqual(0)
    expect(scale('b')).toEqual(1)
    expect(scale('c')).toEqual(0)
  })

  it('should return ordinal colors when there is columnStats', () => {
    const colorsRange = ['#ff0000', '#00ff00', '#0000ff']

    const colorEncoding = new ColorEncoding({
      scale: {
        type: ColorScaleType.SORTED,
        values: ['brazil', 'canada', 'usa'],
        colors: colorsRange,
      },
      field: 'country',
    })
    const stats = {values: ['brazil']} as any
    const column = new Column({name: 'country', stats})
    const rows = new Rows({country: 'brazil'}, {country: 'canada'}, {country: 'usa'})
    const scale = colorEncoding.getScaleFunction(rows, column, ColorFormat.hex)
    const colors = rows.map((row) => scale(row.country))
    expect(colors.toString()).toEqual(colorsRange.toString())
  })
})

describe('getDomain', () => {
  it('it should concat rows and stats domain when columnStats exists', () => {
    const rows = new Rows({'country': 'brazil'}, {'country': 'usa'}, {'country': 'canada'})
    const columnStats = {values: ['mexico', 'brazil']} as any
    behavior = new SortedScaleBehavior('country')
    expect(behavior.getDomain({rows, columnStats})).toEqual([
      'brazil', 'canada', 'mexico', 'usa',
    ])
  })

  it('boolean domains', () => {
    const rows = new Rows({'alerting': false}, {'alerting': true})
    const columnStats = {} as any
    behavior = new SortedScaleBehavior('alerting')
    expect(behavior.getDomain({rows, columnStats})).toEqual([
      false, true,
    ])
  })

  it('it should return [] when columnStats and rows do not not exist', () => {
    behavior = new SortedScaleBehavior('country')
    expect(behavior.getDomain({})).toEqual([])
  })
})
