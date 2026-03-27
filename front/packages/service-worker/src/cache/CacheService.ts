export class CacheService {
  private static getCleanURL(url: string) {
    const indexOfQuery = url.indexOf('?')
    return indexOfQuery > 0 ? url.substring(0, indexOfQuery) : url
  }

  static async invalidateUrl(cacheName: string, url: string) {
    try {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()

      requests.forEach((request) => {
        const cacheUrl = CacheService.getCleanURL(request.url)
        const urlToInvalidate = CacheService.getCleanURL(url)
        if (!urlToInvalidate.startsWith(cacheUrl)) return
        cache.delete(request)
      })
    } catch {
      // should handle invalidating cache error ??
    }
  }


  static async invalidateAll(cacheNames: string[]) {
    cacheNames.forEach(async (cacheName) => {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()
      requests.forEach((request) => {
        cache.delete(request)
      })
    })
  }

  static async delete(cacheName: string) {
    try {
      await caches.delete(cacheName)
    } catch {
      // should handle deleting cache error ??
    }
  }
}
