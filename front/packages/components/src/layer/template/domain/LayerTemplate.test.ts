import { LayerType } from '../../LayerType'
import { LayerTemplates } from './LayerTemplate'

test('Filter allowed', () => {
  const layerTemplateAllowed = { id: 'ok', layers: [{type: LayerType.circle}] } as any
  const layerTemplateNotAllowed = { id: 'ok', layers: [{type: LayerType.polygon}]} as any
  const layerTemplates = new LayerTemplates(layerTemplateAllowed, layerTemplateNotAllowed)

  const filtered = layerTemplates.filterAllowed([LayerType.circle])
  expect(filtered).toHaveLength(1)
  expect(filtered[0].id).toBe('ok')
})
