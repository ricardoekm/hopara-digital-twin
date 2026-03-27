import { isFinite } from 'lodash/fp'

export class Coordinates {
  x: number
  y: number
  z: number

  constructor(props:any = {}) {
    if (!props) {
      props = {}
    }

    this.x = props.x
    this.y = props.y
    this.z = props.z

    if (!this.x || !isFinite(this.x)) this.x = 0
    if (!this.y || !isFinite(this.y)) this.y = 0
    if (!this.z || !isFinite(this.z)) this.z = 0
  }

  static fromArray(xyz) {
    if (!xyz) {
      return new Coordinates()
    }

    return new Coordinates({x: xyz[0], y: xyz[1], z: xyz[2]})
  }

  isAtOrigin() {
    return this.x === 0 && this.y === 0
  }

  toArray() {
    return [this.x, this.y, this.z]
  }

  to2DArray() {
    return [this.x, this.y]
  }

  equals(coordinates: Coordinates) {
    return this.x === coordinates.x && this.y === coordinates.y && this.z === coordinates.z
  }

  toPlain() {
    return {x: this.x, y: this.y, z: this.z}
  }
}
