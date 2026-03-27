import { TextResourceContent, ResourceRepository } from '../resource/ResourceRepository'

export class ScriptService {
    constructor(
        private readonly resourceRepository: ResourceRepository,
      ) {}

    async getScript(templateId: string, scriptName: string) : Promise<TextResourceContent | null> {
        return this.resourceRepository.getText(templateId, 'data', scriptName)
    }
}
