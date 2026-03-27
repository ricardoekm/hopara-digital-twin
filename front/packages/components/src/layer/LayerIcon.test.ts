import {Layer, PlainLayer} from './Layer'
import {LayerType} from './LayerType'
import {DEFAULT_ICON} from '@hopara/encoding/src/icon/IconAccessor'
import {Encodings, IconEncoding} from '@hopara/encoding'
import {Row} from '@hopara/dataset'
import {Layers} from './Layers'
import { getIcon } from './LayerIcon'

const createIconLayer = (props?: { value?: string, field?: string, icon?: string }) => {
  const {value, field} = props ?? {}
  return new Layer({
    type: LayerType.icon,
    name: 'layer-name',
    icon: props?.icon,
    encoding: new Encodings({
      icon: new IconEncoding({
        value,
        field,
      }),
    }),
  } as PlainLayer)
}

const anyRow = new Row({})
const rowWithField = new Row({anyField: 'field-value'})

describe('getIcon', () => {
  it('should return layer-name if value=F,row=F', () => {
    expect(getIcon(createIconLayer())).toEqual('layer-name')
  })
  it('should return value if field=F,value=T,row=F', () => {
    expect(getIcon(createIconLayer({value: 'any-value'}))).toEqual('any-value')
  })
  it('should return value if field=T,value=T,row=F', () => {
    expect(getIcon(createIconLayer({value: 'any-value', field: 'any-field'}))).toEqual('any-value')
  })
  it('should return DEFAULT_ICON if field=F,value=F,row=T', () => {
    expect(getIcon(createIconLayer(), anyRow)).toEqual(DEFAULT_ICON)
  })
  it('should return value if field=F,value=T,row=T', () => {
    expect(getIcon(createIconLayer({value: 'any-value'}), anyRow)).toEqual('any-value')
  })
  it('should return value if field=T,value=T,row=T,row-value=F', () => {
    expect(getIcon(createIconLayer({value: 'any-value', field: 'any-field'}), anyRow)).toEqual('any-value')
  })
  it('should return field-value if field=T,row-value=T', () => {
    expect(getIcon(createIconLayer({field: 'anyField'}), rowWithField)).toEqual('field-value')
  })
  it('should return field-value?fallback=any-value if field=T,value=T,row=T,row-value=T', () => {
    expect(getIcon(createIconLayer({field: 'anyField', value: 'any-value'}), rowWithField)).toEqual('field-value?fallback=any-value')
  })
})

describe('composite layer', () => {
  it('should return layer-name case there is no icon layer inside', () => {
    const layer = new Layer({type: LayerType.composite, name: 'layer-name'} as PlainLayer)
    expect(getIcon(layer)).toEqual('layer-name')
  })

  it('should return layer icon if it exists', () => {
    const layer = new Layer({type: LayerType.composite, name: 'layer-name', icon: 'anyIcon'} as PlainLayer)
    expect(getIcon(layer)).toEqual('anyIcon')
  })

  it('should return icon value if there is an icon layer inside', () => {
    const layer = new Layer({
      type: LayerType.composite,
      children: new Layers(createIconLayer({value: 'any-value'})),
    } as PlainLayer)
    expect(getIcon(layer)).toEqual('any-value')
  })

  it('should return icon field of child layer', () => {
    const layer = new Layer({
      type: LayerType.composite,
      children: new Layers(createIconLayer({field: 'anyField'})),
    } as PlainLayer)
    expect(getIcon(layer, rowWithField)).toEqual('field-value')
  })
})

test('If layer icon is dynamic should return parent name', () => {
  const childLayer = new Layer({
    type: LayerType.icon,
    name: 'icon',
    encoding: new Encodings({
      icon: new IconEncoding({
        field: 'type',
      }),
    }),
  } as PlainLayer)
  const parentLayer = new Layer({name: 'sensors', children: new Layers(childLayer)} as PlainLayer)
  expect(getIcon(parentLayer)).toBe('sensors')
})
