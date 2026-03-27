import {URL} from 'url'
import {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios'
import {Logger} from '@hopara/logger'

export type VisualizationConfig = {
  url: string
}

export class LayerRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly visualizationConfig: VisualizationConfig,
    private readonly logger: Logger,
  ) {
  }

  async getDefaults(visualizationType:string): Promise<any> {
    try {
      this.logger.debug('getting layer defaults')
      const url = new URL(`/layer-defaults/${visualizationType}`, this.visualizationConfig.url)

      const request: AxiosRequestConfig = {
        method: 'GET',
        url: url.href,
      }

      const res = await this.httpClient.request(request)
      return res.data
    } catch (e: any) {
      const error = e as AxiosError<{ message: string }>
      this.logger.error('cannot get layer defaults', {
        response: error.response?.data,
        status: error.response?.status,
      })
    }
  }
}
