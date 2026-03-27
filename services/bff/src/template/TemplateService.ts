import {Repository as VisualizationRepository} from '../visualization/VisualizationRepository'
import {Authorization} from '../authorization'
import { Logger } from '@hopara/logger'
import { TemplateRepository } from './TemplateRepository'

export class TemplateService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly visualizationRepository: VisualizationRepository,
    private readonly logger: Logger
  ) {
  }

  async apply(templateId: string, visualizationName: string | undefined, 
              visualizationId: string | undefined, authorization: Authorization): Promise<any | null> {
    try {
      await this.templateRepository.index(templateId, false, authorization)
      return await this.visualizationRepository.create(templateId, visualizationId as string, visualizationName as string, authorization)
    } catch (error: any) {
      this.logger.error('Error creating visualization', JSON.stringify({ message: error.message, response: error.response?.data }))
      throw new Error(`Failed to create visualization from template: ${JSON.stringify({ message: error.message, response: error.response?.data })}`)
    }
  }

  async applySample(templateId: string, authorization: Authorization): Promise<void> {
    try {
      const visualization = await this.visualizationRepository.get(templateId, undefined, authorization)
      // to avoid users loosing their work when playing with the samples
      if ( visualization == null) { 
        await this.templateRepository.index(templateId, true, authorization)
        await this.visualizationRepository.create(templateId, undefined, undefined, authorization)
      }
    } catch (error: any) {
      this.logger.error(`Error creating visualization templateId: ${templateId}`, JSON.stringify({ message: error.message, response: error.response?.data }))
      throw new Error(`Failed to create visualization from template: ${templateId} ${JSON.stringify({ message: error.message, response: error.response?.data })}`)
    }
  }

  async applySamples(authorization: Authorization): Promise<void> {
    await this.applySample('water-distribution', authorization)
    await this.applySample('lab', authorization)
    await this.applySample('process', authorization)
    await this.applySample('isometric-factory', authorization)
  }
}
