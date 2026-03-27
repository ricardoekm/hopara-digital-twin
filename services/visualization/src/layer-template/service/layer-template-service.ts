import {LayerTemplate, LayerTemplateRepository} from '../layer-template-repository.js'

export interface TemplateData {
  id: string,
  form: Record<string, any>
}

export class LayerTemplateService {
  constructor(private readonly layerTemplateRepository: LayerTemplateRepository) {
  }

  async list(): Promise<LayerTemplate[]> {
    return (await this.layerTemplateRepository.list())
  }
}
