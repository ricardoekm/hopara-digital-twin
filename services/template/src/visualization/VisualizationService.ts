import { ResourceRepository } from '../resource/ResourceRepository'
import { TemplateService } from '../template/TemplateService'

export class VisualizationService {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly templateService: TemplateService
    ) {}

    async getVisualization(templateId: string) : Promise<any> {
        const visualizationResources = await this.templateService.getVisualizations(templateId)

        const visualizationPromises = []
        for ( const visualizationResource of visualizationResources ) {
            const promise = this.resourceRepository.getText(templateId, 'visualizations', visualizationResource.file)
            visualizationPromises.push(promise)
        }

        const resolvedPromises = await Promise.all(visualizationPromises)
        const visualizations = []
        for ( const resource of resolvedPromises ) {
            if ( resource ) {
                visualizations.push(JSON.parse(resource?.Data))
            }
        }
        return visualizations
    }
}
