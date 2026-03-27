import { ResourceRepository } from '../resource/ResourceRepository'
import { Query } from './Query'

export class QueryService {
    constructor(
        private readonly resourceRepository: ResourceRepository,
      ) {}


    async get(templateId: string, queryName: string) : Promise<Query | null> {
        const resource = await this.resourceRepository.getText(templateId, 'queries', `${queryName}.json`)
        if ( resource ) {
            return JSON.parse(resource.Data)
        }

        return null
    }
}
