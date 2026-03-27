import {getColorAccessorInstance, getColorAccessor, getColumn} from './ColorAccessor'
import {ColorConditionalAccessor} from './ColorConditionalAccessor'
import {ColorEncoding} from '../ColorEncoding'
import {ColorFieldAccessor} from './ColorFieldAccessor'
import {ColorLiteralAccessor} from './ColorLiteralAccessor'
import {Column, Columns, FieldRowTranslator, Row, Rows} from '@hopara/dataset'

describe('ColorAccessor', () => {
  describe('getAccessorInstance', () => {
  it('should return ColorConditionalAccessor case encoding has condition', () => {
      const accessor = getColorAccessorInstance(new ColorEncoding({conditions: [{test: {field: 'any'}, value: 'any'}]}) as any)
      expect(accessor).toBeInstanceOf(ColorConditionalAccessor)
    })
    it('should return ColorFieldAccessor case encoding has field and is not Comparison', () => {
      const accessor = getColorAccessorInstance(new ColorEncoding({field: 'any'}) as any)
      expect(accessor).toBeInstanceOf(ColorFieldAccessor)
    })
    it('should return ColorLiteralAccessor case encoding has no field nor condition', () => {
      const accessor = getColorAccessorInstance(new ColorEncoding() as any)
      expect(accessor).toBeInstanceOf(ColorLiteralAccessor)
    })
  })

  describe('getColumn', () => {
    it('should return undefined if colorEncoding is undefined', () => {
      expect(getColumn()).toBeUndefined()
    })
    it('should return undefined if colorEncoding has no field', () => {
      expect(getColumn(new ColorEncoding())).toBeUndefined()
    })
    it('should return undefined if has no columns', () => {
      expect(getColumn(new ColorEncoding({field: 'any'}), undefined)).toBeUndefined()
    })
    it('should return undefined if column is invalid', () => {
      expect(getColumn(new ColorEncoding({field: 'any'}), new Columns())).toBeUndefined()
    })
    it('should return stats if column has stats', () => {
      const columns = new Columns(...[new Column({
        name: 'any',
        stats: {min: 0, max: 1, percentiles: [] },
      })])
      const column = getColumn(new ColorEncoding({field: 'any'}), columns) 
      expect(column?.getStats()).toEqual({min: 0, max: 1, percentiles: []})
    })
  })

  describe('getColorAccessor', () => {
    it('should return encoding value if encoding has value but no field nor condition', () => {
      const rows = new Rows()
      const accessor = getColorAccessor(
        new ColorEncoding({value: '#112233'}),
        rows,
        new Columns(),
        new FieldRowTranslator(rows, 'any'),
      )
      expect(accessor).toEqual([17, 34, 51, 255])
    })

    it('should return a function if encoding has field', () => {
      const row = new Row({any: 10})
      const rows = new Rows(row)
      const accessor = getColorAccessor(
        new ColorEncoding({field: 'any'}),
        rows,
        new Columns(...[new Column({name: 'any', stats: {min: 0, max: 1, percentiles: []}})]),
      )
      expect(accessor).toBeInstanceOf(Function)
      // Must be a RgbaColor aka [r, g, b, a]
      expect((accessor as Function)(row).length).toEqual(4)
    })

    it('should return the value if the field is managed', () => {
      const row = new Row({hopara_color: '#ffdd00'})
      const rows = new Rows(row)
      const accessor = getColorAccessor(
        new ColorEncoding({field: 'hopara_color'}),
        rows,
        new Columns(),
      ) as any

      expect(accessor(row)).toEqual([255, 221, 0, 255])
    })
  })
})
