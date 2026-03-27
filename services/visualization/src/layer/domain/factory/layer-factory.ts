import LayerImpl from '../LayerImpl.js'
import {LayerType} from '../spec/LayerType.js'
import {CircleLayerImpl} from '../CircleLayerImpl.js'
import {IconLayerImpl} from '../IconLayerImpl.js'
import {TextLayerImpl} from '../TextLayerImpl.js'
import {LineLayerImpl} from '../LineLayerImpl.js'
import {PolygonLayerImpl} from '../PolygonLayerImpl.js'
import {ImageLayerImpl} from '../ImageLayerImpl.js'
import {LayerSpec as LayerSpec} from '../spec/Layer.js'
import {ModelLayerImpl} from '../ModelLayerImpl.js'
import {BarLayerImpl} from '../BarLayerImpl.js'
import {ArcLayerImpl} from '../ArcLayerImpl.js'
import {AreaLayerImpl} from '../AreaLayerImpl.js'
import {CompositeLayerImpl} from '../CompositeLayerImpl.js'
import {RectangleLayerImpl} from '../RetangleLayerImpl.js'
import {MapLayerImpl} from '../MapLayerImpl.js'
import {TemplateLayerImpl} from '../TemplateLayerImpl.js'

export class LayerFactory {
  static createFromType(props: LayerSpec): LayerImpl {
    const type = props.type
    if (type === LayerType.circle) {
      return new CircleLayerImpl(props)
    }
    if (type === LayerType.icon) {
      return new IconLayerImpl(props)
    }
    if (type === LayerType.image) {
      return new ImageLayerImpl(props)
    }
    if (type === LayerType.text) {
      return new TextLayerImpl(props)
    }
    if (type === LayerType.line) {
      return new LineLayerImpl(props)
    }
    if (type === LayerType.polygon) {
      return new PolygonLayerImpl(props)
    }
    if (type === LayerType.model) {
      return new ModelLayerImpl(props)
    }
    if (type === LayerType.bar) {
      return new BarLayerImpl(props)
    }
    if (type === LayerType.arc) {
      return new ArcLayerImpl(props)
    }
    if (type === LayerType.area) {
      return new AreaLayerImpl(props)
    }
    if (type === LayerType.rectangle) {
      return new RectangleLayerImpl(props)
    }
    if (type === LayerType.composite) {
      return new CompositeLayerImpl(props)
    }
    if (type === LayerType.map) {
      return new MapLayerImpl(props)
    }
    if (type === LayerType.template) {
      return new TemplateLayerImpl(props)
    }
    throw new Error('Unknown layer type ' + type)
  }

  static fromSpec(spec: LayerSpec): LayerImpl {
    const layer: LayerImpl = this.createFromType({...spec} as LayerSpec)
    if (!layer.encoding) layer.encoding = {}
    return layer
  }
}

