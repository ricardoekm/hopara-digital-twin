import {Row, Rows} from '@hopara/dataset'
import {ColorEncoding} from '../ColorEncoding'
import {rgbColor, toRGBArray} from '../Colors'
import { ColorScaleType } from '../scale/ScaleType'
import {ColorConditionalAccessor} from './ColorConditionalAccessor'

const rows = new Rows(
  {enabled: false, amount: 0}, {enabled: true, amount: 10},
)

it('should use condition test field to return value case is literal', () => {
  const accessor = new ColorConditionalAccessor(new ColorEncoding({
    value: '#ff0000',
    conditions: [{
      test: { field: 'enabled' }, 
      value: '#00ff00',
    }],
  }))
  expect(accessor.getColor(rows, new Row({enabled: true})))
    .toEqual(toRGBArray(rgbColor('#00ff00')))

  expect(accessor.getColor(rows, new Row({enabled: false})))
    .toEqual(toRGBArray(rgbColor('#ff0000')))
})

it('return first true condition', () => {
  const accessor = new ColorConditionalAccessor(new ColorEncoding({
    value: '#ff0000',
    conditions: [{
      test: { field: 'too_high' },
      value: '#00ff00',
    },
    {
      test: { field: 'too_low' },
      value: '#ffffff',
    }],
  }))
  expect(accessor.getColor(rows, new Row({too_low: true})))
    .toEqual(toRGBArray(rgbColor('#ffffff')))

  expect(accessor.getColor(rows, new Row({too_high: true})))
    .toEqual(toRGBArray(rgbColor('#00ff00')))

  
  expect(accessor.getColor(rows, new Row({})))
    .toEqual(toRGBArray(rgbColor('#ff0000')))
})

it('should use condition test field and revert to return value case is literal', () => {
  const accessor = new ColorConditionalAccessor(new ColorEncoding({
    value: '#ff0000',
    conditions: [{
      test: {
        field: 'enabled',
        reverse: true,
      },
      value: '#00ff00',
    }],
  }))
  expect(accessor.getColor(rows, new Row({enabled: true})))
    .toEqual(toRGBArray(rgbColor('#ff0000')))

  expect(accessor.getColor(rows, new Row({enabled: false})))
    .toEqual(toRGBArray(rgbColor('#00ff00')))
})

it('should use condition test field to return translucent value case is literal', () => {
  const accessor = new ColorConditionalAccessor(new ColorEncoding({
    value: '#ff0000',
    conditions: [{
      test: {field: 'enabled'},
      value: '#00ff00',
      opacity: 0.5,
    }],
  }))
  expect(accessor.getColor(rows, new Row({enabled: true})))
    .toEqual(toRGBArray(rgbColor('#00ff00').copy({opacity: 0.5})))
})

it('should use condition test field to return value case if field based', () => {
  const accessor = new ColorConditionalAccessor(new ColorEncoding({
    scale: {
      type: ColorScaleType.SORTED,
      scheme: 'yellowgreen',
      values: [10],
    },
    field: 'amount',
    conditions: [{
      test: { field: 'enabled' },
      scale: {
        type: ColorScaleType.SORTED,
        scheme: 'purpleblue',
        values: [10],
      },
      field: 'amount',
    }],
  }))
  expect(accessor.getColor(rows, new Row({enabled: true, amount: 10})))
    .toEqual(toRGBArray(rgbColor('#C8CEE4')))

  expect(accessor.getColor(rows, new Row({enabled: false, amount: 10})))
    .toEqual(toRGBArray(rgbColor('#D1ECA0')))
})
