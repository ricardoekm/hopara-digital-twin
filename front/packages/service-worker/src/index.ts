import './CRA'
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute } from 'workbox-routing'
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update'
import { CacheInvalidatePlugin } from './cache/CacheInvalidatePlugin'
import { CacheService } from './cache/CacheService'
import { DedupStaleWhileRevalidateStrategy } from './strategy/DedupStaleWhileRevalidateStrategy'
import { DedupCacheFirstStrategy } from './strategy/DedupCacheFirstStrategy'
import { urlMachesResourceType } from './resource/ResourceUrl'
import { ResourceCacheKey, ResourceType } from './resource/Resource'
import { Config } from '@hopara/config'
import { BFF_VISUALIZATION_CACHE_KEY } from './bff/BFF'
import { CacheKeyPlugin } from './cache/CacheKeyPlugin'
import { PassThroughStrategy } from './strategy/PassThroughStrategy'

declare const self: ServiceWorkerGlobalScope & {skipWaiting: any, addEventListener: any}

clientsClaim()

self.addEventListener('install', () => {
  self.skipWaiting()
  const keys = [...Object.values(ResourceCacheKey), BFF_VISUALIZATION_CACHE_KEY]
  CacheService.invalidateAll(keys)
})

registerRoute(
  urlMachesResourceType(ResourceType.ICON),
  new DedupCacheFirstStrategy({
    cacheName: ResourceCacheKey.ICON,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 2000,
        purgeOnQuotaError: true,
        matchOptions: {
          ignoreVary: true,
        },
      }),
    ],
  }),
  'GET',
)

registerRoute(
  urlMachesResourceType(ResourceType.IMAGE),
  new DedupStaleWhileRevalidateStrategy({
    cacheName: ResourceCacheKey.IMAGE,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        matchOptions: {
          ignoreVary: true,
        },
      }),
    ],
  }),
  'GET',
)

registerRoute(
  urlMachesResourceType(ResourceType.IMAGE, true),
  new PassThroughStrategy({
    plugins: [
      new CacheInvalidatePlugin({ cacheName: ResourceCacheKey.IMAGE }),
    ],
  }),
  'PUT',
)

registerRoute(
  urlMachesResourceType(ResourceType.MODEL),
  new DedupStaleWhileRevalidateStrategy({
    cacheName: ResourceCacheKey.MODEL,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 8,
        matchOptions: {
          ignoreVary: true,
        },
      }),
      new CacheKeyPlugin({ headers: ['Accept'] }),
    ],
  }),
  'GET',
)

registerRoute(
  urlMachesResourceType(ResourceType.MODEL, true),
  new PassThroughStrategy({
    plugins: [
      new CacheInvalidatePlugin({ cacheName: ResourceCacheKey.MODEL }),
    ],
  }),
  'PUT',
)

registerRoute(
  ({ url }) => url.origin === Config.getValue('BFF_API_ADDRESS') && url.pathname.startsWith('/visualization/'),
  new DedupStaleWhileRevalidateStrategy({
    cacheName: BFF_VISUALIZATION_CACHE_KEY,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        matchOptions: {
          ignoreVary: true,
        },
      }),
      new BroadcastUpdatePlugin(),
      new CacheKeyPlugin({ headers: ['Tenant'] }),
    ],
  }),
  'GET',
)

registerRoute(
  ({ url }) => url.origin === Config.getValue('VISUALIZATION_API_ADDRESS') && url.pathname.startsWith('/visualization'),
  new PassThroughStrategy({
    plugins: [
      new CacheInvalidatePlugin({ cacheName: BFF_VISUALIZATION_CACHE_KEY }),
    ],
  }),
  'PUT',
)
