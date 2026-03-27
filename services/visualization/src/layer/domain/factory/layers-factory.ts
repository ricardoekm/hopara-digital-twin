import {LayersImpl} from '../LayersImpl.js'
import {LayerFactory} from './layer-factory.js'
import {LayerSpec as LayerSpec} from '../spec/Layer.js'

export class LayersFactory {
  static fromSpec(spec: LayerSpec[]): LayersImpl {
    return new LayersImpl(...spec.map((layer) => LayerFactory.fromSpec(layer)))
  }
}
