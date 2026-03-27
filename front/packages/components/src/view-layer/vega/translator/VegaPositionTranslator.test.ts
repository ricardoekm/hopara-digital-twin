import { PositionEncoding, PositionScaleType } from '@hopara/encoding'
import { VegaPositionTranslator } from './VegaPositionTranslator'

const translator = new VegaPositionTranslator()
test('Translate position encoding', () => {
  const positionEncoding = new PositionEncoding({x: { field: 'time'}, y: { field: 'temperature' }})
  const positionScales = {
    x: PositionScaleType.TIME,
    y: PositionScaleType.LINEAR,
  }  

  const vegaEncoding = translator.translate(positionEncoding, positionScales)
  expect(vegaEncoding.x.field).toEqual('time')
  expect(vegaEncoding.y.field).toEqual('temperature')
})

test('Y2 inherts y scale', () => {
  const positionEncoding = new PositionEncoding({y: { field: 'temperature' }, y2: { field: 'temperature2' }})
  const positionScales = {
    y: PositionScaleType.LINEAR,
  }  

  const vegaEncoding = translator.translate(positionEncoding, positionScales as any)
  expect(vegaEncoding.y.field).toEqual('temperature')
  expect(vegaEncoding.y.type).toEqual('quantitative')
  expect(vegaEncoding.y2.field).toEqual('temperature2')
  expect(vegaEncoding.y2.type).toEqual('quantitative')
})


test('If doesnt have encoding dont translate', () => {
  const positionEncoding = new PositionEncoding({x: { field: 'time'}})
  const positionScales = { x: PositionScaleType.TIME }  

  const vegaEncoding = translator.translate(positionEncoding, positionScales as any)
  expect(vegaEncoding.x.field).toEqual('time')
  expect(vegaEncoding.y).toBeUndefined()
})
