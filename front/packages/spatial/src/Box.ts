import {Dimensions} from './Dimensions'
import {Range} from './Range'
import { lineIntersectsPolygon, pointInPolygon, polygonInPolygon, polygonIntersectsPolygon } from 'geometric'

export class Box {
  x: Range
  y: Range

  constructor({x, y}: {x: Range, y: Range}) {
    this.x = x
    this.y = y
  }

  isPointInRange(point: {x:number, y:number}): boolean {
    return this.x.isInRange(point.x) && this.y.isInRange(point.y)
  }

  isPolygonInRange(polygon: number[][]): boolean {
    if (!polygon.length) return false
    if (polygon.length === 1) return pointInPolygon(polygon[0] as any, this.getPolygon() as any)
    if (polygon.length === 2) {
      return lineIntersectsPolygon(polygon as any, this.getPolygon() as any) ||
             pointInPolygon(polygon[0] as any, this.getPolygon() as any) ||
             pointInPolygon(polygon[1] as any, this.getPolygon() as any)
    }

    return polygonIntersectsPolygon(polygon as any, this.getPolygon() as any) ||
           polygonInPolygon(polygon as any, this.getPolygon() as any) ||
           polygonInPolygon(this.getPolygon() as any, polygon as any)
  }

  getDimensions() : Dimensions {
    return {width: this.x.getInterval(), height: this.y.getInterval()}
  }

  getPolygon(): number[][] {
    return [[this.x.getMin(), this.y.getMin()], 
      [this.x.getMax(), this.y.getMin()], 
      [this.x.getMax(), this.y.getMax()], 
      [this.x.getMin(), this.y.getMax()], 
      [this.x.getMin(), this.y.getMin()]]
  }

  getBounds(): [[number, number], [number, number]] {
    return [[this.x.getMin(), this.y.getMin()], [this.x.getMax(), this.y.getMax()]]
  }

  multiply(factor:number): Box {
    return new Box({
      x: this.x.multiply(factor),
      y: this.y.multiply(factor),
    })
  }

  bottomLeft(): [number, number] {
    return [this.x.getMin(), this.y.getMin()]
  }

  topRight(): [number, number] {
    return [this.x.getMax(), this.y.getMax()]
  }

  topMiddlePoint(): [number, number] {
    return [this.x.getMin() + this.x.getInterval() / 2, this.y.getMax()]
  }

  bottomMiddlePoint(): [number, number] {
    return [this.x.getMin() + this.x.getInterval() / 2, this.y.getMin()]
  }

  clamp(box: Box) {
    return new Box({
      x: this.x.clamp(box.x),
      y: this.y.clamp(box.y),
    })
  }

  static fromBounds(bounds: [number, number, number, number]): Box {
    return new Box({
      x: new Range({min: bounds[0], max: bounds[2]}),
      y: new Range({min: bounds[1], max: bounds[3]}),
    })
  }
}

const WORLD_BOX = new Box({x: new Range(), y: new Range})
export {WORLD_BOX}
