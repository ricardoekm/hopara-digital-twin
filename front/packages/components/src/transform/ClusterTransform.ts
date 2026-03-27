 
import {Columns, ColumnType, Row, Rows} from '@hopara/dataset'
import Supercluster, {PointFeature} from 'supercluster'
import {RowCoordinates} from '@hopara/spatial'
import { TransformType } from '@hopara/encoding/src/transform/Transform'
import ViewState from '../view-state/ViewState'
import { FrontOnlyTransform } from './FrontOnlyTransform'

export class ClusterTransform extends FrontOnlyTransform {
  radius: number
  type: TransformType

  constructor(radius?: number) {
    super()
    this.type = TransformType.cluster
    if (radius) {
      this.radius = radius
    } else {
      this.radius = 30
    }
  }

  getParams() {
    return {}
  }

  apply(rows: Rows, columns: Columns, viewState: ViewState): Rows {
    const index = new Supercluster({
      maxZoom: 24,
      radius: this.radius * Math.sqrt(2),
      map: (row: Row) => {
        const map = {} as Record<string, any>
        columns.forEach((column) => {
          if (!(column.isQuantitative() || column.isType(ColumnType.BOOLEAN))) return
          map[column.getName()] = row.getValue(column.getName())
        })
        return map
      },
      reduce: (acc, row) => {
        columns.forEach((column) => {
          if (!(column.isQuantitative() || column.isType(ColumnType.BOOLEAN))) return
          const name = column.getName()
          acc[column.getName()] = acc[name] > row[name] ? acc[name] : row[name]
        })
      },
    })
    index.load((rows as Row[]).map((row: Row) => {
      return {
        geometry: {coordinates: row.getCoordinates().to2DArray()},
        properties: row,
      } as PointFeature<Row>
    }) as PointFeature<Row>[])

    const clusteredFeatures = index.getClusters([-180, -85, 180, 85], Math.floor(viewState.zoom ?? 0))

    return new Rows(...clusteredFeatures.map((feature) => {
      return new Row({
        ...feature.properties,
        _id: `cluster-${feature.properties.cluster_id ?? feature.properties._id}`,
        point_count: feature.properties.point_count ?? 1,
      }).updateCoordinates(new RowCoordinates({x: feature.geometry.coordinates[0], y: feature.geometry.coordinates[1]}))
    }))
  }
}
