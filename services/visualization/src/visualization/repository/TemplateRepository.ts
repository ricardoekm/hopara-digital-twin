import {URL} from 'url'
import {AxiosInstance} from 'axios'
import {VisualizationSpec} from '../domain/spec/Visualization.js'

export type TemplateConfig = {
  url: string
}

export class TemplateRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly templateConfig: TemplateConfig,
  ) {
  }

  async getVisualizations(templateId: string): Promise<VisualizationSpec[]> {
    try {
      const url = new URL(`/template/${templateId}/visualization`, this.templateConfig.url)
      const res = await this.httpClient.request({
        method: 'GET',
        url: url.href,
      })
      return res.data
    } catch (e:any) {
      throw new Error(`Error fetching template "${templateId}": ${e.response?.data}`)
    }
  }
}
