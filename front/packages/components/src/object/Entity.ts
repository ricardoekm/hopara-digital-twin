import { Layer } from '../layer/Layer'

export class Entity {
  layer: Layer

  constructor(layer:Layer) {
    this.layer = layer
  }

  clone(): Entity {
    return new Entity(this.layer)
  }
}

