import {Queries} from '@hopara/dataset'
import {Layer} from '../layer/Layer'
import {Layers} from '../layer/Layers'
import Entities from './Entities'
import {Entity} from './Entity'
import {reverse, uniqBy} from 'lodash/fp'
import {LayerType} from '../layer/LayerType'
import {PositionType} from '@hopara/encoding/src/position/PositionEncoding'

export class EntityFactory {
  private static isCandidateLayer(layer: Layer, queries: Queries) {
    if (layer.isType(LayerType.map)) {
      return false
    }

    // To allow upload
    if (layer.isType(LayerType.image) || layer.isType(LayerType.model)) {
      return true
    }

    if (layer.encoding?.position && layer.encoding.position.getType() === PositionType.REF) {
      return false
    }

    const query = queries.findQuery(layer.getPositionQueryKey())
    if (query) {
      return layer.isPlaceable(query.canUpdate())
    }

    return false
  }

  static create(layers: Layers, queries: Queries): Entities {
    const candidateLayers = layers.filter((layer) => this.isCandidateLayer(layer, queries))
    const entityLayers = reverse(uniqBy((layer: Layer) => layer.getRowsetId(), reverse(candidateLayers)))
    const entities = entityLayers.map((layer) => new Entity(layer))
    return new Entities(...entities)
  }
}
