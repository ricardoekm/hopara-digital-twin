import { Data } from '../../../data/domain/spec/Data.js'
import { CoordinatesPositionEncoding, FloorPositionEncoding, AxisPositionEncoding } from '../spec/PositionEncoding.js'

export class PositionEncodingImpl {
  data?: Data
  coordinates?: CoordinatesPositionEncoding
  x?: AxisPositionEncoding
  y?: AxisPositionEncoding
  z?: AxisPositionEncoding
  floor?: FloorPositionEncoding
  scope?: string

  constructor(props: Partial<PositionEncodingImpl>) {
    Object.assign(this, props)
  }

  setX(x: AxisPositionEncoding) : void {
    this.x = x
  }

  setY(y: AxisPositionEncoding) : void {
    this.y = y
  }
}
