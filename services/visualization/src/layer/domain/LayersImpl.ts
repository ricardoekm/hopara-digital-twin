import { QueryKeys } from '../../data/QueryKeys.js'
import LayerImpl from './LayerImpl.js'

export class LayersImpl extends Array<LayerImpl> {
  constructor(...layers: LayerImpl[]) {
    super(...layers)
  }

  getQueryKeys(): QueryKeys {
    const queryKeys = this.map((layer) => layer.getQueryKeys()).flat()
    return new QueryKeys(...queryKeys)
  }
}
