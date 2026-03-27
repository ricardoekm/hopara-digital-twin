import { Row } from '@hopara/dataset'
import { Anchor } from '@hopara/spatial'


export class PositionAccessorFactory {
  static create(anchor:Anchor | undefined) {
    return (row: Row): [number, number, number?] | undefined => {
      if (!row || !row.getCoordinates()) return
      return row.getCoordinates().toArray(anchor)
    }
  }
}
