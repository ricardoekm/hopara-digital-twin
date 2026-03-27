import {LayerType} from './spec/LayerType.js'
import {VisibleImpl} from './VisibleImpl.js'
import {SizeEncodingImpl} from '../../encoding/domain/impl/SizeEncodingImpl.js'
import {ColorEncodingImpl} from '../../encoding/domain/impl/ColorEncodingImpl.js'
import {PositionEncodingImpl} from '../../encoding/domain/impl/PositionEncodingImpl.js'
import {QueryKey} from '../../data/QueryKey.js'
import {TransformType} from './spec/Transform.js'
import LayerImpl from './LayerImpl.js'
import { EncodingName } from '../../encoding/domain/Encoding.js'
import { CircleLayerImpl } from './CircleLayerImpl.js'

export class TestLayerImpl extends LayerImpl {
  getDefaultEncodings(): EncodingName[] {
      return []
  }
}

describe('constructor', () => {
  it('should have visible of Visible type', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
    })
    expect(layer.visible instanceof VisibleImpl).toBe(true)
  })

  it('should have an empty encoding if no encoding is provided', () => {
    const layer = new TestLayerImpl({
      type: LayerType.rectangle,
    })
    expect(layer.encoding).toEqual({})
  })

  it('should have an empty data if no data is provided', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
    })
    expect(layer.data).toEqual({})
  })

  it('should have details with tooltip true by default', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
    })
    expect(layer.details?.tooltip).toBe(true)
  })

  it('should have details with tooltip false if tooltip is false', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
      details: {
        tooltip: false,
      },
    })
    expect(layer.details?.tooltip).toBe(false)
  })

  it('should have an empty actions if no actions is provided', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
    })
    expect(layer.actions).toEqual([])
  })

  it('should convert spec to size encoding', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
      encoding: {
        size: {},
      },
    })
    expect(layer.encoding.size instanceof SizeEncodingImpl).toBe(true)
  })

  it('should use a default size encoding if no spec is provided', () => {
    const layer = new CircleLayerImpl({
      type: LayerType.circle,
      encoding: {
        size: undefined,
      },
    })
    expect(layer.encoding.size instanceof SizeEncodingImpl).toBe(true)
    expect(layer.encoding.size).toEqual({value: 32})
  })

  it('should have an default strokeSize encoding', () => {
    const layer = new CircleLayerImpl({
      type: LayerType.circle,
      encoding: {
        strokeSize: {},
      },
    })
    expect(layer.encoding.strokeSize instanceof SizeEncodingImpl).toBe(true)
  })

  it('should have an default color encoding', () => {
    const layer = new CircleLayerImpl({
      type: LayerType.circle,
      encoding: {
        color: {},
      },
    })
    expect(layer.encoding.color instanceof ColorEncodingImpl).toBe(true)
  })

  it('should have an default strokeColor encoding', () => {
    const layer = new CircleLayerImpl({
      type: LayerType.circle,
      encoding: {
        strokeColor: {},
      },
    })
    expect(layer.encoding.strokeColor instanceof ColorEncodingImpl).toBe(true)
  })

  it('should have an default position encoding', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
      encoding: {
        position: {},
      },
    })
    expect(layer.encoding.position instanceof PositionEncodingImpl).toBe(true)
  })
})

describe('getQueryKey', () => {
  it('should return the transform if it exists', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
      data: {
        source: 'any-source',
        query: 'any-query',
        transform: {type: TransformType.cluster, radius: 30},
      },
    })
    expect(layer.getQueryKeys().length).toEqual(2)
    expect(layer.getQueryKey()).toEqual(new QueryKey({
      query: 'any-query',
      source: 'any-source',
      transform: 'cluster',
    }))
  })


  it('should return only data if no transform exists', () => {
    const layer = new TestLayerImpl({
      type: LayerType.circle,
      data: {
        source: 'any-source',
        query: 'any-query',
      },
    })
    expect(layer.getQueryKey()).toEqual(new QueryKey({
      query: 'any-query',
      source: 'any-source',
    }))
  })
})
