import { ColorEncoding, ColorScaleType } from '@hopara/encoding'
import { VegaColorTranslator } from './VegaColorTranslator'

const translator = new VegaColorTranslator()

test('Translate fixed color encoding', () => {
  const colorEncoding = new ColorEncoding({value: '#4c78a8', opacity: 0.5})
  
  const vegaEncoding = translator.translate(colorEncoding)
  expect(vegaEncoding.color.value).toEqual('#4c78a8')
  expect(vegaEncoding.opacity.value).toEqual(0.5)
})

test('Translate field color encoding', () => {
  const colorScale = { type: ColorScaleType.SORTED, scheme: 'pubu' }
  const colorEncoding = new ColorEncoding({field: 'assetType', scale: colorScale})
  
  const vegaEncoding = translator.translate(colorEncoding)
  expect(vegaEncoding.color.field).toEqual('assetType')
  expect(vegaEncoding.color.scale.scheme).toEqual('pubu')
})
