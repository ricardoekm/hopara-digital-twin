import { layerEditorFactories } from './LayerEditorFactories'
import { SizeEditorFactory } from './size/SizeEditorFactory'
import { SizeMultiplierEditorFactory } from './size/SizeMultiplierEditorFactory'

jest.mock('axios-retry', () => jest.fn())

test('get editor by name', () => {
  const editorFactories = layerEditorFactories.getEditorFactories([
    {'name': 'encoding.size'},
  ])

  expect(editorFactories[0]).toBeInstanceOf(SizeEditorFactory)
})

test('get editor by definition name', () => {
  const editorFactories = layerEditorFactories.getEditorFactories([
    {'name': 'encoding.size', 'definitionName': 'SizeMultiplierEncoding'},
  ])

  expect(editorFactories[0]).toBeInstanceOf(SizeMultiplierEditorFactory)
})
