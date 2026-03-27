import { RowCoordinates } from './RowCoordinates'

export class NullRowCoordinates extends RowCoordinates {
  constructor() {
    super({
      x: null,
      y: null,
      z: null,
      geometry: [], 
    })
  }

  isPlaced(): boolean {
      return false
  }

  hasGeometry(): boolean {
      return false
  }
}
