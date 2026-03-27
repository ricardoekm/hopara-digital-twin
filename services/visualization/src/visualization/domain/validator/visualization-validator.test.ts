import {FieldValidator} from '../../../data/domain/field-validator.js'
import {LayerValidator} from '../../../layer/domain/validator/layer-validator.js'
import {VisualizationValidator} from './visualization-validator.js'
import {LayersValidator} from '../../../layer/domain/validator/layers-validator.js'
import {FiltersValidator} from '../../../filter/domain/filters-validator.js'
import {Columns} from '../../../data/query/Columns.js'
import {LayerType} from '../../../layer/domain/spec/LayerType.js'
import {VisualizationType} from '../spec/Visualization.js'
import {QueryNotFoundError, QueryValidator} from '../../../data/domain/query-validator.js'
import Filter from '../../../filter/domain/Filter.js'
import {QueryKeys} from '../../../data/QueryKeys.js'
import {QueryKey} from '../../../data/QueryKey.js'
import {Visualization} from '../Visualization.js'
import {LayersImpl} from '../../../layer/domain/LayersImpl.js'
import Filters from '../../../filter/domain/Filters.js'
import {LegendsValidator} from './legends-validator.js'
import {PrimaryKeyValidator} from '../../../layer/domain/validator/primary-key-validator.js'
import {ColumnsMap} from '../../../data/ColumnsMap.js'
import {CircleLayerImpl} from '../../../layer/domain/CircleLayerImpl.js'

const schemaRepository = {
  tryValidate: jest.fn(),
}

const createValidator = (): VisualizationValidator => {
  const fieldValidator = new FieldValidator()
  const queryValidator = new QueryValidator()
  const primaryKeyValidator = new PrimaryKeyValidator()
  const layerValidator = new LayerValidator(fieldValidator, primaryKeyValidator)
  return new VisualizationValidator(
    new LayersValidator(layerValidator),
    new FiltersValidator(fieldValidator),
    new LegendsValidator(),
    queryValidator,
    null as any,
    schemaRepository as any,
  )
}

const anyQueryColumns = new Columns({
  name: 'any-field',
  type: 'any-type',
}, {
  name: 'any-image-field',
  type: 'IMAGE',
})

const otherQueryColumns = new Columns({
  name: 'other-field',
  type: 'any-type',
})

const transformColumns = new Columns({
  name: 'transform-field',
  type: 'any-type',
})

const columnsMap = new ColumnsMap()
columnsMap.add({source: 'any-source', query: 'any-query'}, anyQueryColumns)
columnsMap.add({source: 'any-source', query: 'any-query', transform: 'TIME'}, transformColumns)
columnsMap.add({source: 'other-source', query: 'other-query'}, otherQueryColumns)

const anyQueryKeys = new QueryKeys()
anyQueryKeys.add({source: 'any-source', query: 'any-query'})
anyQueryKeys.add({source: 'other-source', query: 'other-query'})

const emptyDataColumns = new ColumnsMap()

const createVisualizationWithLayer = (layerProps: any, visualization?: any): Visualization => {
  const layer = new CircleLayerImpl({
    name: 'any-layer-name',
    data: {source: 'any-source', query: 'any-query'},
    type: LayerType.circle,
    encoding: {
      position: {
        x: {field: 'any-field'},
        y: {field: 'any-field'},
      },
    },
    ...layerProps,
  })

  return new Visualization({
    ...visualization,
    name: 'any-visualization-name',
    type: VisualizationType.GEO,
    id: 'any visualization id',
    layers: new LayersImpl(layer),
  })
}

const createVisualizationMockWithFilter = (filterProps: any): Visualization => {
  const filter = new Filter({
    data: {source: 'any-source', query: 'any-query'},
    field: 'any-field',
    ...filterProps,

  })

  return new Visualization({
    name: 'any-visualization-name',
    type: VisualizationType.GEO,
    id: 'any visualization id',
    layers: new LayersImpl(),
    filters: new Filters(filter),
  } as any)
}

describe('VisualizationValidator', () => {
  describe('schema', () => {
    it('return no errors if schemaRepository returns no error', async () => {
      const validator = createValidator()
      const visualization = createVisualizationWithLayer({
        encoding: {
          color: {field: 'any-field', value: 'red'},
        },
      })
      const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
      expect(schemaRepository.tryValidate).toHaveBeenCalledWith(expect.any(Buffer))
      expect(errors.length).toEqual(0)
    })

    it('return error if schemaRepository returns error', async () => {
      schemaRepository.tryValidate.mockResolvedValue(new Error('any-error'))
      const validator = createValidator()
      const visualization = createVisualizationWithLayer({
        encoding: {
          color: {field: 'any-field', value: 'red'},
        },
      })
      const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
      schemaRepository.tryValidate.mockResolvedValue(undefined)
      expect(schemaRepository.tryValidate).toHaveBeenCalledWith(expect.any(Buffer))
      expect(errors.length).toEqual(1)
    })
  })

  describe('validate', () => {
    describe('layer', () => {
      it('should not throw error if query exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            color: {field: 'any-field', value: 'red'},
          },
        })
        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should throw error if layer query does not exist', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer(
          {data: {source: 'any-source', query: 'invalid-query'}},
        )

        const errors = await validator.tryValidate(visualization, emptyDataColumns, new QueryKeys())
        const queryKey = new QueryKey({source: 'any-source', query: 'invalid-query'})
        const expectedError = new QueryNotFoundError(queryKey)
        expect(errors[0]).toEqual(expectedError)
      })

      it('should accept if layer field exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            color: {field: 'any-field', value: 'red'},
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should accept if layer complex field exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            color: {field: 'any-field.any-attribute', value: 'red'},
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should accept if transform configuration field exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          transforms: {
            room: {
              group: {
                field: 'any-field',
              },
            },
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should accept if layer transform field exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          transforms: {
            time: {
              resolution: {
                min: 0,
                max: 10,
              },
            },
          },
          encoding: {
            color: {field: 'any-field', value: 'red'},
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should reject if layer field does not exist', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {color: {field: 'invalid-field', value: 'red'}},
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(1)
      })

      it('should accept if layer deep field exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            size: {field: 'any-field', value: 10},
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('scale', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            position: {
              x: {
                scale: {
                  domain: {
                    data: {
                      source: 'other-source',
                      query: 'other-query',
                    },
                    field: 'other-field',
                  },
                },
              },
            },
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })

      it('should reject if layer deep field does not exist', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          encoding: {
            size: {field: 'invalid-field', value: 10},
          },
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(1)
      })

      it('should accept error if jump visualization exists', async () => {
        const validator = createValidator()
        const visualization = createVisualizationWithLayer({
          actions: [
            {
              title: 'any action',
              action: {
                jump: {
                  visualization: 'any visualization id',
                  field: 'any-field',
                },
              },
            }],
        })

        const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
        expect(errors.length).toEqual(0)
      })
    })
  })

  describe('filter', () => {
    it('should reject if filter field does not exist', async () => {
      const validator = createValidator()
      const visualization = createVisualizationMockWithFilter({
        data: {source: 'any-source', query: 'any-query'},
        field: 'invalid-field',
      })

      const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
      expect(errors.length).toEqual(1)
    })

    it('should accept if filter field exists', async () => {
      const validator = createValidator()
      const visualization = createVisualizationMockWithFilter({
        data: {source: 'any-source', query: 'any-query'},
        field: 'any-field',
      })

      const errors = await validator.tryValidate(visualization, columnsMap, anyQueryKeys)
      expect(errors.length).toEqual(0)
    })
  })
})
