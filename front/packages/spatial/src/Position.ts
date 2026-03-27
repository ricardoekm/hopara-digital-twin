export type Position2D = [number, number]
export type Position3D = [number, number, number]

export class Position extends Array<number> {
  getX(): number {
    return this[0]
  }

  getY(): number {
    return this[1]
  }

  getZ(): number {
    return this[2]
  }
}
