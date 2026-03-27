import {RenderController} from './RenderController'

test('If newly instantiate returns true', () => {
  const renderController = new RenderController()
  expect(renderController.shouldRender()).toEqual(true)
})

test('If cache key changes return true', () => {
  const renderController = new RenderController()
  renderController.update({ cacheKey: 'abc' })
  expect(renderController.shouldRender()).toEqual(true)
  renderController.update({ cacheKey: 'abc' })
  expect(renderController.shouldRender()).toEqual(false)

  renderController.update({ cacheKey: 'cde' })
  expect(renderController.shouldRender()).toEqual(true)
})
