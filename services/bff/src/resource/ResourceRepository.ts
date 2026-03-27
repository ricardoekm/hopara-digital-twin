import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Logger } from '@hopara/logger'
import { Authorization } from '../authorization'
import { URL } from 'url'

export type ResourceConfig = {
  url: string
}

interface IconLibrary {
  name: string
}

export class ResourceRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly resourceConfig: ResourceConfig,
    private readonly logger: Logger,
  ) {
  }

  private getHeaders(authorization: Authorization): any {
    return {
      'authorization': authorization.token,
      'tenant': authorization.tenant,
    }
  }

  async listIconLibraries(authorization: Authorization): Promise<IconLibrary[]> {
    try {
      const url = new URL(`/tenant/${authorization.tenant}/icon-library`, this.resourceConfig.url)

      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'GET',
        url: url.href,
      }
      const res = await this.httpClient.request(request)
      return res.data
    } catch (e: any) {
      this.logger.error('can not list icon libraries', {
        response: e.response?.data,
        status: e.response?.status,
      })
      throw new Error(e.response?.data)
    }
  }

  async listIcons(name: string, authorization: Authorization) {
    try {
      const url = new URL(`/tenant/${authorization.tenant}/icon-library/${name}/icon?limit=12`, this.resourceConfig.url)

      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'GET',
        url: url.href,
      }
      const res = await this.httpClient.request(request)
      // shuffling the icons to make it more random
      res.data.sort(() => Math.random() - 0.5)
      return res.data.slice(0, 12)
    } catch (e: any) {
      this.logger.error('can not list icons', {
        response: e.response?.data,
        status: e.response?.status,
      })
      throw new Error(e.response?.data)
    }
  }

  async rollbackImage(id: string, library: string, date: any, authorization: Authorization) {
    try {
      const resourceDate = Math.floor(date / 10000)
      const url = new URL(`/tenant/${authorization.tenant}/image-library/${library}/image/${id}/history/${resourceDate}/restore`, this.resourceConfig.url)
      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'PUT',
        url: url.href,
        timeout: 60 * 1000,
      }
      await this.httpClient.request(request)
    } catch (e: any) {
      this.logger.error('cannot rollback resources', {
        response: e.response?.data,
        status: e.response?.status,
      })
      throw new Error(e.response?.data)
    }
  }

  async rollbackModel(id: string, library: string, date: any, authorization: Authorization) {
    try {
      const resourceDate = Math.floor(date / 10000)
      const url = new URL(`/tenant/${authorization.tenant}/model-library/${library}/model/${id}/history/${resourceDate}/restore`, this.resourceConfig.url)
      const request: AxiosRequestConfig = {
        headers: this.getHeaders(authorization),
        method: 'PUT',
        url: url.href,
        timeout: 60 * 1000,
      }
      await this.httpClient.request(request)
    } catch (e: any) {
      this.logger.error('cannot rollback resources', {
        response: e.response?.data,
        status: e.response?.status,
      })
      throw new Error(e.response?.data)
    }
  }
}
