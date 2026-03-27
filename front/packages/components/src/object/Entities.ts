import {Entity} from './Entity'

class Entities extends Array<Entity> {
  clone(): Entities {
    return new Entities(...this)
  }
}

export default Entities
