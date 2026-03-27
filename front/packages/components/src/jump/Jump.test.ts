import { VisualizationJump } from '../action/Action'
import { createJumpUrl } from './Jump'
import { SelectedFilters } from '../filter/domain/SelectedFilters'
import { SelectedFilter } from '../filter/domain/SelectedFilter'

test('Create jump url', () => {
  const action = new VisualizationJump({visualization: 'any-viz'})
  const filters = new SelectedFilters(new SelectedFilter({field: 'field', values: ['value']}))

  expect(createJumpUrl(action, 'myTenant', filters)).toEqual('/myTenant/visualization/any-viz?filter=%7B%22field%22%3A%22field%22%2C%22values%22%3A%5B%22value%22%5D%7D')
})
