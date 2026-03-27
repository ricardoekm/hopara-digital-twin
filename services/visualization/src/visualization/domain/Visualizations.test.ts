import {VisualizationFactory} from './factory/visualization-factory.js'
import {VisualizationType} from './spec/Visualization.js'
import {Visualization} from './Visualization.js'
import Filters from '../../filter/domain/Filters.js'
import Filter from '../../filter/domain/Filter.js'
import {QueryKeys} from '../../data/QueryKeys.js'

describe('fromSpec', () => {
  it('should generate an index based id for each visualization', () => {
    const visualization = VisualizationFactory.fromSpec({
      type: VisualizationType.CHART, layers: [],
    })
    expect(visualization.id).toMatch(/^[0-9a-f-]{36}$/)
  })
  it('should generate an empty filters to visualization with no filter', () => {
    const visualization = VisualizationFactory.fromSpec({
      type: VisualizationType.CHART, layers: [],
    })
    expect(visualization.filters).toEqual([])
  })
})

it('get query keys', () => {
  const visualization = new Visualization({
    id: 'any-id',
    name: 'any-name',
    type: VisualizationType.CHART,
    filters: new Filters(
      new Filter({
        field: 'any-field',
        data: {source: 'any-source', query: 'query-a'},
      })
    ),
  })

  const expectedQueryKeys = new QueryKeys()
  expectedQueryKeys.add({source: 'any-source', query: 'query-a'})
  expect(visualization.getQueryKeys()).toEqual(expectedQueryKeys)
})

describe('duplicate', () => {
  it('should duplicate', () => {
    const visualization = new Visualization({
      id: 'any-id',
      name: 'any-name',
    })
    const dupl = visualization.duplicate('new-name')
    expect(dupl.id).not.toEqual(visualization.id)
    expect(dupl.name).toEqual('new-name')
  })

  it('duplicate removes group', () => {
    const visualization = new Visualization({
      id: 'any-id',
      name: 'any-name',
      group: 'my-group',
    })
    const dupl = visualization.duplicate('new-name')
    expect(dupl.id).not.toEqual(visualization.id)
    expect(dupl.name).toEqual('new-name')
    expect(dupl.group).toBeUndefined()
  })
})

