import {LayerSanitizer} from './layer-sanitizer.js'
import {Columns} from '../../data/query/Columns.js'
import {ColumnsMap} from '../../data/ColumnsMap.js'
import {QueryKey} from '../../data/QueryKey.js'
import {LayerType} from '../domain/spec/LayerType.js'
import {CircleLayerImpl} from '../domain/CircleLayerImpl.js'

describe('LayerSanitizer', () => {
  it('should remove fields that do not exist in columns', () => {
    const layer = new CircleLayerImpl({
      type: LayerType.circle,
      data: {source: 'any-source', query: 'any-query'},
      details: {
        fields: [{
          value: {encoding: {text: {field: 'valid-field'}}},
        }, {
          value: {encoding: {text: {field: 'valid.because.it.has.dots'}}},
        }, {
          value: {encoding: {text: {field: 'invalid-field'}}},
        }],
      },
    })

    const columns = new ColumnsMap()
    columns.add(new QueryKey({source: 'any-source', query: 'any-query'}), new Columns(...[{
      name: 'valid-field',
      type: 'string',
    }]))

    const sanitizedLayer = LayerSanitizer.sanitize(layer, columns)
    expect(sanitizedLayer.details!.fields).toEqual([{
      value: {encoding: {text: {field: 'valid-field'}}},
    }, {
      value: {encoding: {text: {field: 'valid.because.it.has.dots'}}},
    }])
  })
})
