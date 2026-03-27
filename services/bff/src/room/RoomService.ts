import { Logger } from '@hopara/logger'
import { Authorization } from '../authorization'
import { Repository as DatasetRepository } from '../query/DatasetRepository'
import { Room } from './Room'
import { VisualizationRepository } from '../visualization/VisualizationRepository'

export class RoomService {
  constructor(
      private readonly datasetRepository: DatasetRepository,
      private readonly visualizationRepository: VisualizationRepository,
      private readonly logger: Logger,
    ) {
    }

  async getRooms(
    source: string,
    query: string,
    positionField: string,
    titleField: string | undefined,
    coordinates: [number, number] | undefined,
    authorization: Authorization
  ): Promise<Room[] | null> {
    // Implementation
    try {
      const distanceSort = coordinates && coordinates.length ? {
        coordinates,
        columns: [positionField],
      } : undefined

      const dataResponse = await this.datasetRepository.getRows({name: query, dataSource: source}, 50, distanceSort, authorization)
      const dataPrimaryKey = (dataResponse.columns.find((c: any) => c.primaryKey) as any)?.name ?? 'id'

      return dataResponse.rows?.map((row: any) => {
        return new Room({
          id: row[dataPrimaryKey],
          name: row[titleField ?? dataPrimaryKey] ?? row[dataPrimaryKey],
        })
      })
    } catch (e:any) {
      this.logger.error('can not get rooms', {error: e})
      return null
    }
  }
}
