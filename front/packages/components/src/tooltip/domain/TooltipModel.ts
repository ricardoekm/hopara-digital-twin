import {Coordinates} from '@hopara/spatial'
import {Row} from '@hopara/dataset'

export class Tooltip {
  row?: Row
  rowsetId?: string
  layerId: string
  coordinates: Coordinates
  hovering: boolean

  constructor(props: Partial<Tooltip>) {
    Object.assign(this, props)
  }

  clone(): Tooltip {
    return new Tooltip(this)
  }

  getCoordinates(): Coordinates {
    return this.coordinates
  }

  isHovering(): boolean {
    return this.hovering
  }
}

export default Tooltip
