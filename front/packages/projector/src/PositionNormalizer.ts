import { Row, Rows, SCOPE_COLUMN_NAME } from '@hopara/dataset'
import { PositionEncoding } from '@hopara/encoding'
import { AxisPositionEncoding } from '@hopara/encoding/src/position/PositionEncoding'
import { RowCoordinates } from '@hopara/spatial'
import { isNil } from 'lodash/fp'

export class PositionNormalizer {
  private getValue(row: Row, fieldPositionEncoding:AxisPositionEncoding) {
    if (fieldPositionEncoding.field) {
      return row[fieldPositionEncoding.field]
    } else if (!isNil(fieldPositionEncoding.value)) {
      return fieldPositionEncoding.value
    }
  }

  private getBaseCoordinates(row:Row, positionEncoding:PositionEncoding) {
    if (positionEncoding.coordinates?.field) {
      const rowCoordinates = new RowCoordinates({geometry: row[positionEncoding.coordinates?.field]})
      if (positionEncoding.detailedCoordinates?.field) {
        rowCoordinates.setDetailedGeometry(row[positionEncoding.detailedCoordinates.field])
      }
      return rowCoordinates
    }

    if (positionEncoding.x && positionEncoding.y) {
      const x = this.getValue(row, positionEncoding.x as any)
      const y = this.getValue(row, positionEncoding.y as any)

      if (positionEncoding.z) {
        const z = this.getValue(row, positionEncoding.z as any)
        return new RowCoordinates({x, y, z})
      } else {
        return new RowCoordinates({x, y})
      }
    }
  }

  private getCoordinates(row:Row, positionEncoding?:PositionEncoding) {
    if (!positionEncoding) return

    const coordinates = this.getBaseCoordinates(row, positionEncoding)
    if (positionEncoding.floor?.field) {
      coordinates?.setFloor(row[positionEncoding.floor?.field])
    }

    return coordinates
  }

  normalize(row:Row, positionEncoding?:PositionEncoding, force?: boolean) : Row {
    // We don't need to normalize twice
    if (row._coordinates && !force) {
      return row
    }

    const coordinates = this.getCoordinates(row, positionEncoding)
    if (coordinates?.isPlaced()) {
      coordinates.setProjected(false)
      return new Row({...row, _coordinates: coordinates})
    }
    
    return row
  }

  normalizeRows(rows:Rows, positionEncoding?:PositionEncoding) : Rows {
    if (!positionEncoding) {
      return rows
    }

    const normalizeRows = rows.map((row) => this.normalize(row, positionEncoding))
    normalizeRows.updateEtagModifier('positionNormalizer', positionEncoding.getId())
    return normalizeRows
  }

  private denormalizeCoordinates(row:Row, positionEncoding:PositionEncoding) {
    const unprojectedValues = {}
    unprojectedValues[positionEncoding.coordinates!.field!] = row.getCoordinates().getGeometry()

    if (positionEncoding.detailedCoordinates?.field) {
      unprojectedValues[positionEncoding.detailedCoordinates.field] = row.getCoordinates().getDetailedGeometry()
    }

    return unprojectedValues
  }

  private denormalizeCoordinatesLike(row:Row, positionEncoding:PositionEncoding) {
    const unprojectedValues = {}
    unprojectedValues[positionEncoding.x!.field!] = row.getCoordinates().getGeometryLike()
    return unprojectedValues
  }

  private denormalizePointGeometry(row: Row, positionEncoding:PositionEncoding) {
    const unprojectedValues = {}
    unprojectedValues[positionEncoding.x!.field!] = [[row.getCoordinates().getCentroidX(), row.getCoordinates().getCentroidY()]]

    if (positionEncoding.z?.field) {
      if (positionEncoding.x?.field === positionEncoding.z?.field) {
        unprojectedValues[positionEncoding.z?.field][0][2] = row.getCoordinates().getCentroidZ()
      } else {
        unprojectedValues[positionEncoding.z?.field] = row.getCoordinates().getCentroidZ()
      }
    }

    return unprojectedValues
  }

  private denormalizePosition(row: Row, positionEncoding:PositionEncoding) {
    const unprojectedValues = {}

    if (positionEncoding.x?.field) {
      unprojectedValues[positionEncoding.x.field] = row.getCoordinates().getCentroidX()
    }

    if (positionEncoding.y?.field) {
      unprojectedValues[positionEncoding.y.field] = row.getCoordinates().getCentroidY()
    }

    if (positionEncoding.z?.field) {
      unprojectedValues[positionEncoding.z.field] = row.getCoordinates().getCentroidZ()
    }

    return unprojectedValues
  }

  private isCoordinatesBased(positionEncoding: PositionEncoding): boolean {
    return !!positionEncoding.coordinates?.field
  }

  private isPointGeometry(positionEncoding:PositionEncoding) {
    if (!isNil(positionEncoding.x?.field) && !isNil(positionEncoding.y?.field)) {
      return positionEncoding.x?.field === positionEncoding.y?.field
    }

    return false
  }

  getNullPositionValues(positionEncoding: PositionEncoding) {
    const unplacedValues = {}
    if (positionEncoding.x?.field) {
      unplacedValues[positionEncoding.x.field] = null
    }

    if (positionEncoding.y?.field) {
      unplacedValues[positionEncoding.y.field] = null
    }

    if (positionEncoding.z?.field) {
      unplacedValues[positionEncoding.z.field] = null
    }

    if (positionEncoding.coordinates?.field) {
      unplacedValues[positionEncoding.coordinates.field] = null
    }

    if (positionEncoding.detailedCoordinates?.field) {
      unplacedValues[positionEncoding.detailedCoordinates.field] = null
    }

    return unplacedValues
  }

  private getBasePositionValues(row: Row, positionEncoding: PositionEncoding) {
    if (this.isCoordinatesBased(positionEncoding)) {
      return this.denormalizeCoordinates(row, positionEncoding)
    } else if (row.getCoordinates().isGeometryLike()) {
      return this.denormalizeCoordinatesLike(row, positionEncoding)
    } else if (this.isPointGeometry(positionEncoding)) {
      return this.denormalizePointGeometry(row, positionEncoding)
    } else {
      return this.denormalizePosition(row, positionEncoding)
    }
  }

  // Return the row attributes that composes the position (e.g. lat/long)
  // filled based on the row coordinates
  getPositionValues(row: Row, positionEncoding: PositionEncoding) : any {
    if (!row || !row.isPlaced()) {
      return this.getNullPositionValues(positionEncoding)
    }

    const positionValues = this.getBasePositionValues(row, positionEncoding)
    if (positionEncoding.floor?.field) {
      positionValues[positionEncoding.floor?.field] = row.getCoordinates().getFloorName()
    }

    if (positionEncoding.scope) {
      positionValues[SCOPE_COLUMN_NAME] = positionEncoding.scope
    }

    return positionValues
  }
}
