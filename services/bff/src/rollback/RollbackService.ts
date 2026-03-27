import { Authorization } from '../authorization'
import { DatasetRepository } from '../query/DatasetRepository'
import { ResourceRepository } from '../resource/ResourceRepository'
import { VisualizationRepository } from '../visualization/VisualizationRepository'
import { RollbackQueriesFactory, RollbackQuery } from './RollbackQueriesFactory'

export class RollbackService {
    constructor(
        private readonly datasetRepository: DatasetRepository,
        private readonly visualizationRepository: VisualizationRepository,
        private readonly resourceRepository: ResourceRepository
      ) {
      }

    async rollbackItem(rollbackQuery:RollbackQuery, date: any, filters: any, authorization: Authorization) {
       const ids = await this.datasetRepository.rollback(rollbackQuery.queryKey, date, filters, authorization)
       if ( rollbackQuery.imageScope ) {
        for ( const id of ids ) {
          await this.resourceRepository.rollbackImage(id, rollbackQuery.imageScope, date, authorization)
        }        
       } else if ( rollbackQuery.modelScope ) {
         for ( const id of ids ) {
           await this.resourceRepository.rollbackModel(id, rollbackQuery.modelScope, date, authorization)
         }        
       }
    }

    async rollback(visualizationId:string, date: any, filters: any, authorization: Authorization) {
        const visualization = await this.visualizationRepository.get(visualizationId, undefined, authorization)
        if (!visualization) {
            throw new Error(`visualization ${visualizationId} not found`)
        }

        const rollbackQueries = RollbackQueriesFactory.getQueries(visualization)
        const promises:any[] = []
        rollbackQueries.forEach((query) => {
          promises.push(this.rollbackItem(query, date, filters, authorization))
        })
        await Promise.all(promises)
    }
}
