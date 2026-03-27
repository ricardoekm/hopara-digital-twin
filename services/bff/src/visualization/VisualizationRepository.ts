import { URL } from 'url'
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logger } from '@hopara/logger'
import { Visualization } from './Visualization'
import { Authorization } from '../authorization'
import { BadRequestError, ExternalResponseError, UnauthorizedError } from '@hopara/http-server'

export type VisualizationConfig = {
  url: string
}

export interface Repository {
  get (visualizationId: string, version: number | undefined, authorization: Authorization): Promise<Visualization | null>
  create (templateId: string, visualizationId: string | undefined, visualizationName: string | undefined, authorization: Authorization): Promise<void>
  list (group: string, authorization: Authorization): Promise<{ id: string, name: string }[]>
}

export class VisualizationRepository implements Repository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly visualizationConfig: VisualizationConfig,
    private readonly logger: Logger,
  ) {
  }

  private getHeaders(authorization: Authorization): any {
    return {
      'authorization': authorization.token,
      'tenant': authorization.tenant,
    }
  }

  async get(visualizationId: string, version: number | undefined, authorization: Authorization): Promise<Visualization | null> {
    try {
      this.logger.debug('getting visualization', { visualizationId })
      let url
      if (version) {
        url = new URL(`/visualization/${visualizationId}?version=${version}`, this.visualizationConfig.url)
      } else {
        url = new URL(`/visualization/${visualizationId}`, this.visualizationConfig.url)
      }
      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'GET',
        url: url.href,
        timeout: 10 * 1000,
      }

      this.logger.debug('new visualization request', request)

      const res = await this.httpClient.request(request)
      if (!res.data) return null
      return new Visualization(res.data)
    } catch (e: any) {
      const error = e as AxiosError<{ message: string }>
      if (error.response?.status === 401) throw new UnauthorizedError(error.response?.data.message)
      if (error.response?.status === 404) return null

      this.logger.error('can not get visualization', {
        visualizationId,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw new ExternalResponseError(
        error.response?.data.message ?? 'unknown error',
        error.response?.status as number,
      )
    }
  }

  async create(templateId: string, visualizationId: string | undefined, visualizationName: string | undefined, authorization: Authorization): Promise<void> {
    try {
      this.logger.debug('saving visualization', { templateId })
      const url = new URL(`/template-visualization/${templateId}`, this.visualizationConfig.url)

      const res = await this.httpClient.request({
        headers: this.getHeaders(authorization),
        data: {
          id: visualizationId,
          name: visualizationName,
        },
        method: 'POST',
        url: url.href,
      })
      return res.data
    } catch (e: any) {
      const error = new BadRequestError(e.response?.data.message);
      (error as any).errors = e.response?.data.errors
      throw error
    }
  }

  async list(group: string, authorization: Authorization): Promise<{ id: string, name: string }[]> {
    try {
      const url = new URL(`/visualization`, this.visualizationConfig.url)
      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'GET',
        params: { group },
        url: url.href,
      }
      this.logger.debug('list visualization request', request)
      const res = await this.httpClient.request(request)
      if (!res.data) return []
      return res.data
    } catch (e: any) {
      const error = e as AxiosError<{ message: string }>
      this.logger.error('can not list visualization', {
        response: error.response?.data,
        status: error.response?.status,
      })
      if (error.response?.status === 404) return []
      throw new ExternalResponseError(
        error.response?.data.message ?? 'unknown error',
        error.response?.status as number,
      )
    }
  }
}
