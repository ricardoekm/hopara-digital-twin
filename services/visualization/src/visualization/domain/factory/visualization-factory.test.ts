import {LayerType} from '../../../layer/domain/spec/LayerType.js'
import {VisualizationSpec, VisualizationType} from '../spec/Visualization.js'
import * as Ajv from 'ajv'
import {getSchema} from '../../../schema/schema-repository.js'
import {VisualizationFactory} from './visualization-factory.js'
import {CircleLayer} from '../../../layer/domain/spec/Layer.js'

const anyValidVisualizationSpec: VisualizationSpec = {
  name: 'any-viz-name',
  type: VisualizationType.GEO,
  layers: [{
    name: 'any-layer-name',
    data: {
      source: 'any-source', query: 'any-query',
    },
    type: LayerType.circle,
    encoding: {
      color: {
        field: 'any-color-field',
      },
      position: {
        x: {field: 'any-field'},
        y: {field: 'any-field'},
      },
      size: {value: 10},
    },
  } as CircleLayer],
  filters: [
    {
      data: {source: 'any-source', query: 'any-query'},
      field: 'any-field',
    },
  ],
}

describe('fromSpec', () => {
  it('should create with a valid visualization spec', () => {
    const visualization = VisualizationFactory.fromSpec(anyValidVisualizationSpec)
    const ajv = new Ajv.Ajv({strict: false})
    ajv.validate(getSchema('VisualizationSpec'), visualization)
    expect(ajv.errors).toBeFalsy()
  })

  it('should create slugified name for id if not set', () => {
    const visualization = VisualizationFactory.fromSpec({...anyValidVisualizationSpec, name: 'My Visualization'})
    expect(visualization.id).toEqual('my-visualization')
  })

  it('should create an empty visualizations if not set', () => {
    const visualization = VisualizationFactory.fromSpec({} as any)
    expect(visualization).toMatchObject({
      encodingScope: 'QUERY',
      filters: [],
      layers: [],
      zoomBehavior: {
        x: 'SCALE',
        y: 'SCALE',
      },
      zoomRange: {
        max: {
          value: 24,
        },
        min: {
          value: 0,
        },
      },
    })
  })
})
