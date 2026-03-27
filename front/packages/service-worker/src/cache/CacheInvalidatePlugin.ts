import { WorkboxPlugin } from 'workbox-core'
import { CacheService } from './CacheService'

export class CacheInvalidatePlugin implements WorkboxPlugin {
  cacheName: string

  constructor({ cacheName }) {
    this.cacheName = cacheName
  }

  async fetchDidSucceed({ request, response }) {
    CacheService.invalidateUrl(this.cacheName, request.url)
    return response
  }
}
