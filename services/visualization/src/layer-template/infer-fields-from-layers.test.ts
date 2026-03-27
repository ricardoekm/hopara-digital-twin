import {inferFieldsFromLayers} from './infer-fields-from-layers.js'

describe('infer-fields-from-data', () => {
  it('it should infer properties', () => {
    const data = [{
      field: '{{field}}',
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual(['field'])
  })

  it('ignore id fields', () => {
    const data = [{
      field: '{{id#0}}',
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual([])
  })

  it('it should infer properties from nested objects', () => {
    const data = [{
      field: {
        nested_field: '{{field}}',
      },
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual(['field'])
  })
  it('it should infer properties from arrays', () => {
    const data = [{
      field: ['{{field}}'],
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual(['field'])
  })
  it('it should infer properties from nested arrays', () => {
    const data = [{
      field: [['{{field}}']],
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual(['field'])
  })
  it('should not duplicate fields', () => {
    const data = [{
      field: '{{field}}',
      anotherField: '{{field}}',
    }]
    const fields = inferFieldsFromLayers(data)
    expect(fields).toEqual(['field'])
  })
})
