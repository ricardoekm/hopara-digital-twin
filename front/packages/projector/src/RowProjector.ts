import { Row, Rows } from '@hopara/dataset'
import { isArray } from 'lodash/fp'
import { Projector } from './Projector'
import { RowCoordinates } from '@hopara/spatial'

export class RowProjector {
  projector: Projector

  constructor(projector:Projector) {
    this.projector = projector
  }

  // The index is passed by the map in the recursive call
  private projectGeometry(data:any, index?: number): any {
    if (isArray(data)) return data.map(this.projectGeometry.bind(this))
    if (index === 0) return this.projector.projectX(Number(data))
    if (index === 1) return this.projector.projectY(Number(data))
    if (index === 2) return Number(data)

    return data
  }

  projectCoordinates(coordinates:RowCoordinates) {
    if (coordinates.getGeometry()) {
      const geometry = this.projectGeometry(coordinates.getGeometry())
      return new RowCoordinates({geometry})
    } else if (coordinates.isGeometryLike()) {
      const geometry = this.projectGeometry(coordinates.getGeometryLike())      
      if (coordinates.hasZ()) {
        return new RowCoordinates({x: geometry, y: geometry, z: geometry})
      } else {
        return new RowCoordinates({x: geometry, y: geometry})
      }
    } else {
      const projectedValues = {
        x: this.projector.projectX(coordinates.getCentroidX()),
        y: this.projector.projectY(coordinates.getCentroidY()),
        z: coordinates.getCentroidZ(),
      }
      return new RowCoordinates({x: projectedValues.x, y: projectedValues.y, z: projectedValues.z})
    }
  }

  // The index is passed by the map in the recursive call
  private unprojectGeometry(data:any, index?: number): any {
    if (isArray(data)) return data.map(this.unprojectGeometry.bind(this))
    if (index === 0) return this.projector.unprojectX(Number(data))
    if (index === 1) return this.projector.unprojectY(Number(data))
    if (index === 2) return Number(data)

    return data
  }

  unprojectCoordinates(coordinates:RowCoordinates) {
    if (coordinates.getX() && isArray(coordinates.getX())) {
      const geometry = this.unprojectGeometry(coordinates.getX())      
      return new RowCoordinates({x: geometry, y: geometry})
    } else {
      const unprojectedValues = {
        x: this.projector.unprojectX(coordinates.getCentroidX()),
        y: this.projector.unprojectY(coordinates.getCentroidY()),
        z: coordinates.getCentroidZ(),
      }
      return new RowCoordinates({x: unprojectedValues.x, y: unprojectedValues.y})
    }
  }

  unproject(row:Row) : Row {
    if (!row.isPlaced()) {
      return row
    }

    const unprojectedCoordinates = this.unprojectCoordinates(row.getCoordinates())
    unprojectedCoordinates.setProjected(false)
    return row.updateCoordinates(unprojectedCoordinates)
  }

  project(row:Row): Row {    
    if (!row.isPlaced() || row.getCoordinates().isProjected()) {
      return row
    }

    const projectedCoordinates = this.projectCoordinates(row.getCoordinates())
    return row.updateCoordinates(projectedCoordinates)
  }

  projectRows(rows:Rows): Rows {
    const projectedRows = rows.map((row) => {
      const projectedRow = this.project(row)      
      return new Row(projectedRow)
    })

    return projectedRows
  }
}
