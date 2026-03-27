 
import {Columns, Row, Rows} from '@hopara/dataset'
import Supercluster, {PointFeature} from 'supercluster'
import { TransformType } from '@hopara/encoding/src/transform/Transform'
import ViewState from '../view-state/ViewState'
import { FrontOnlyTransform } from './FrontOnlyTransform'

export class NeighborCountTransform extends FrontOnlyTransform {
  radius: number
  type: TransformType

  constructor(radius?: number) {
    super()
    this.type = TransformType.neighborCount
    if (radius) {
      this.radius = radius
    } else {
      this.radius = 30
    }
  }

  getParams() {
    return {}
  }

  apply(rows: Rows, columns:Columns, viewState:ViewState): Rows {
    const index = new Supercluster({
      maxZoom: 24,
      radius: this.radius * Math.sqrt(2),      
    })
    index.load((rows as Row[]).map((row: Row) => {
      return {
        geometry: {coordinates: row.getCoordinates().to2DArray()},
        properties: row,
      } as PointFeature<Row>
    }) as PointFeature<Row>[])

    const clusteredFeatures = index.getClusters([-180, -85, 180, 85], Math.floor(viewState.zoom ?? 0))
    const clusterRows = clusteredFeatures.map((feature) => {    
      if (!feature.properties.cluster) {
        const row = new Row({
          ...feature.properties,
          neighbor_count: 0,
          has_neighbors: false,
        })
        return [row]
      }

      const clusterId = feature.properties.cluster_id
      const leaves = index.getLeaves(clusterId, Infinity)
      return leaves.map((leaf) => {
        const row = leaf.properties
        return new Row({
          ...row,
          neighbor_count: feature.properties.point_count ?? 1,
          has_neighbors: !!feature.properties.point_count,
        })
      })
    })

    
    return new Rows(...clusterRows.flat())
  }
}
