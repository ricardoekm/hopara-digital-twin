import {URL} from 'url'
import {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios'
import {Logger} from '@hopara/logger'
import {Authorization} from '../authorization'

export type VisualizationConfig = {
  url: string
}

export class LayerTemplateRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly visualizationConfig: VisualizationConfig,
    private readonly logger: Logger,
  ) {
  }

  async getTemplates(authorization: Authorization): Promise<any> {
    try {
      this.logger.debug('getting layer defaults')
      const url = new URL(`/layer-template`, this.visualizationConfig.url)

      const request: AxiosRequestConfig = {
        method: 'GET',
        url: url.href,
        headers: {
          Authorization: authorization.token,
          tenant: authorization.tenant,
        },
        timeout: 10 * 1000,
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
