import { Column, ColumnType, ComparisonType, DatasetRepository, Query, Row } from '@hopara/dataset'
import { Authorization } from '@hopara/authorization'

export class FitToBuildingService {
  constructor(private readonly datasetRepository: DatasetRepository) {}

  async getBuildingGeometry(row: Row, authorization: Authorization) {
    const geometryColumn = new Column({name: 'geom', type: ColumnType.GEOMETRY})

    const filter = {comparisonType: ComparisonType.INTERSECTS, 
                    column: geometryColumn.getName(),
                    values: [row.getCoordinates().getGeometryLike()]}

    const query = new Query({name: 'buildings', dataSource: 'hopara'})
    query.getColumns().push(geometryColumn)

    const params = { filterSet: { filters: [filter], limit: 1 }, query, authorization}
    const response = await this.datasetRepository.getRows(params)
    if (!response.rows?.length) return
    return {geometry: response.rows[0].geom, boundingBox: response.rows[0].bounding_box}
  }
}
