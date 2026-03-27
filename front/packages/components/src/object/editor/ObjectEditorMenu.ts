import {Queries} from '@hopara/dataset'
import {Layers} from '../../layer/Layers'
import {MenuItem} from '../../menu/MenuStore'
import {EntityFactory} from '../EntityFactory'

export const createObjectEditorMenu = (layers: Layers, queries: Queries): MenuItem[] => {
  if (!layers?.length || !queries?.length) return []

  const entities = EntityFactory.create(layers, queries)

  return entities.map((entity) => {
    return ({
      id: entity.layer.getId(),
      name: entity.layer.name,
    })
  })
}
