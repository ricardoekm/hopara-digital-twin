import { SizeEncoding } from '@hopara/encoding'
import { VegaSizeTranslator } from './VegaSizeTranslator'
import { LayerType } from '../../../layer/LayerType'

const translator = new VegaSizeTranslator()

test('Translate size encoding', () => {
  const sizeEncoding = new SizeEncoding({value: 10})
  
  const vegaEncoding = translator.translate(LayerType.circle, sizeEncoding)
  expect(vegaEncoding.size?.value).toEqual(10)
})
