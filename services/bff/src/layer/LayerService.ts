import { Logger } from '@hopara/logger'
import { Authorization } from '../authorization'
import { Repository as DatasetRepository } from '../query/DatasetRepository'
import { VisualizationRepository } from '../visualization/VisualizationRepository'
import { LayerData } from './LayerData'

export class LayerService {
  constructor(
      private readonly datasetRepository: DatasetRepository,
      private readonly visualizationRepository: VisualizationRepository,
      private readonly logger: Logger,
    ) {
    }

  async getLayerData(
    visualizationId: string,
    layerId: string,
    authorization: Authorization
  ): Promise<LayerData | null> {
    try {
      const visualization = await this.visualizationRepository.get(visualizationId, undefined, authorization)
      const layer = visualization?.getLayer(layerId)
      const data = visualization?.getPositionData(layer)
      const titleField = layer.details?.fields?.find((d: any) => d.value?.encoding?.text?.field)?.value.encoding.text.field
      const positionField = layer.encoding.position.coordinates?.field ?? layer.encoding.position.x?.field
      return data ? {...data, titleField, positionField} : null
    } catch (e:any) {
      this.logger.error('can not get layer data', {error: e})
      return null
    }
  }
}
