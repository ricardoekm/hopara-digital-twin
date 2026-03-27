import {VisualizationEntity} from './visualization-entity.js'

describe('VisualizationEntity', () => {
  it('toDomain', () => {
    const entity = new VisualizationEntity()
    entity.id = 'any-id'
    entity.name = 'any-name'
    entity.schema = 'https://schema.hopara.app/app/0.21'
    entity.visualizations = '{"type": "GEO"}'

    const domain = entity.toDomain()

    expect(domain).toMatchObject({
      id: 'any-id',
      name: 'any-name',
      type: 'GEO',
    })
  })

  it('fromDomain', () => {
    const entity = VisualizationEntity.fromDomain({
      id: 'any-id',
      name: 'any-name',
      type: 'GEO',
    } as any)

    expect(entity.id).toEqual('any-id')
    expect(entity.name).toEqual('any-name')
    expect(entity.visualizations).toEqual('{"type":"GEO"}')
  })
})
