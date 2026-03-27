import { CacheKeyWillBeUsedCallbackParam, WorkboxPlugin } from 'workbox-core'

export class CacheKeyPlugin implements WorkboxPlugin {
  headers: string[]

  constructor({ headers }: { headers: string[] }) {
    this.headers = headers
  }

  private getUrlWithCacheKeys(request: Request) {
    const cacheUrl = new URL(request.url)
    this.headers.forEach((header) => {
      cacheUrl.searchParams.set(`_header_${header}`, request.headers.get(header) || '')
    })
    return cacheUrl.toString()
  }

  async cacheKeyWillBeUsed({request}: CacheKeyWillBeUsedCallbackParam) {
    return this.getUrlWithCacheKeys(request)
  }
}
