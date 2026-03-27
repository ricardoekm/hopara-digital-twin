import { isNil } from 'lodash'
import { Scales } from './Scales'

export class Projector {
  scales: Scales
  createdTimestamp: Date

  constructor(scales:Scales) {
    this.scales = scales
    this.createdTimestamp = new Date()
  }

  projectX(value: number): number | undefined {
    if (this.scales.x) {
      return this.scales.x(value)
    }

    return value
  }

  projectY(value: number): number | undefined {
    if (this.scales.y) {
      return this.scales.y(value)
    }

    return value
  }

  project(point: [x: number, y: number, z?: number]): [x: number | undefined, y: number | undefined, z?: number] | undefined {
    const p: [x: number | undefined, y: number | undefined, z?: number] = [
      this.projectX(point[0]),
      this.projectY(point[1]),
    ]

    if (point[2] !== undefined) {
      p.push(point[2])
    }

    return p
  }

  cast(value:number | Date) {
    if (value instanceof Date) {
      return value.getTime()
    }

    return value
  }

  unprojectX(value: number): number | undefined {
    if (isNil(value)) return 0
    return this.cast(this.scales.x.invert(value))
  }

  unprojectY(value: number): number | undefined {
    if (isNil(value)) return 0
    return this.cast(this.scales.y.invert(value))
  }

  unproject(point: [x: number, y: number, z?: number]): [x: number | undefined, y: number | undefined, z?: number] | undefined {
    const p: [x: number | undefined, y: number | undefined, z?: number] = [
      this.unprojectX(point[0]),
      this.unprojectY(point[1]),
    ]

    if (point[2] !== undefined) {
      p.push(point[2])
    }

    return p
  }
}
