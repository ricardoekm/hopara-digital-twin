import { Config } from '@hopara/config'
import { getPageUrl, PageNavigation } from './PageNavigation'
import { PageType } from './Pages'
import { NavigationType } from 'react-router-dom'

const navigateTo = jest.fn()
const anyLocation = {
  pathname: '/mock-path',
  search: '',
  hash: '',
  state: {},
  key: '',
}
const anyNavigationType = NavigationType.Replace

it('should get url with params', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  expect(navigation.getUrl(PageType.VisualizationDetail, {visualizationId: 'my-viz'})).toEqual('/mock-tenant/visualization/my-viz')
  expect(navigation.getUrl(PageType.VisualizationDetail, {visualizationId: 'my-viz', queryParam: 'a', otherParam: 'b'})).toEqual('/mock-tenant/visualization/my-viz?queryParam=a&otherParam=b')
})

it('should get url with array params', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  expect(navigation.getUrl(PageType.VisualizationDetail, {visualizationId: 'my-viz'})).toEqual('/mock-tenant/visualization/my-viz')
  expect(navigation.getUrl(PageType.VisualizationDetail, {visualizationId: 'my-viz', queryParam: ['a', 'b']})).toEqual('/mock-tenant/visualization/my-viz?queryParam=a&queryParam=b')
})

it('should get full url', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  expect(navigation.getUrl(PageType.VisualizationDetail, {visualizationId: 'my-viz'}, {hard: true})).toEqual(`${Config.getValue('BASE_URL')}/mock-tenant/visualization/my-viz`)
})

it('should open url', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  window.open = jest.fn()
  navigation.navigate(PageType.VisualizationDetail, {visualizationId: 'my-viz'}, {hard: true})
  expect(window.open).toHaveBeenCalledWith(`${Config.getValue('BASE_URL')}/mock-tenant/visualization/my-viz`, '_self')
})

it('should open url on _top', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  window.open = jest.fn()
  navigation.navigate(PageType.VisualizationDetail, {visualizationId: 'my-viz'}, {hard: true, target: '_top'})
  expect(window.open).toHaveBeenCalledWith(`${Config.getValue('BASE_URL')}/mock-tenant/visualization/my-viz`, '_top')
})

it('should navigate to url', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  navigation.navigate(PageType.VisualizationDetail, {visualizationId: 'my-viz'})
  expect(navigateTo).toHaveBeenCalledWith('/mock-tenant/visualization/my-viz', undefined)
})

it('should navigate to url with replace', () => {
  const navigation = new PageNavigation(navigateTo, 'mock-tenant', {}, anyLocation, anyNavigationType)
  navigation.navigate(PageType.VisualizationDetail, {visualizationId: 'my-viz'}, {replace: true})
  expect(navigateTo).toHaveBeenCalledWith('/mock-tenant/visualization/my-viz', {replace: true})
})

describe('Get Page Url', () => {
  it('should get page url with params', () => {
    const pageUrl = getPageUrl(PageType.VisualizationDetail, 'mock-tenant', {visualizationId: 'my-viz'})
    expect(pageUrl).toEqual('/mock-tenant/visualization/my-viz')
  })

  it('params should exactly match to replace', () => {
    const pageUrl = getPageUrl(PageType.VisualizationDetail, 'mock-tenant', {visualization: 'my-wrongViz', visualizationId: 'my-viz'})
    expect(pageUrl).toEqual('/mock-tenant/visualization/my-viz?visualization=my-wrongViz')
  })
})
