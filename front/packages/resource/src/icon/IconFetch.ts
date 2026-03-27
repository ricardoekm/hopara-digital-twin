import {fetchFile} from '@loaders.gl/core'
import {Authorization} from '@hopara/authorization'
import {IconUrlResolver} from './IconUrlResolver'
import {ResourceType, FetchProgressCallback, FetchResource, handleFetchProgressCallback} from '../fetch'

const ICON_PLACEHOLDER_NAME = 'map-marker'

export class IconFetch implements FetchResource {
  static getIconUrl(iconName: string, authorization: Authorization, fallback?: string) {
    return IconUrlResolver.resolve(authorization.tenant, undefined, iconName, fallback)
  }

  getFetchOptions(options: any) {
    return {
      ...options,
      cache: 'force-cache',
    }
  }

  fetch(downloadProgressCallback: FetchProgressCallback, getAbortController?: () => AbortController, authorization?: Authorization) {
    return async (iconName: string, options: any): Promise<any> => {
      try {
        const response = await fetchFile(IconFetch.getIconUrl(iconName, authorization!), this.getFetchOptions(options))
        if (downloadProgressCallback) await handleFetchProgressCallback(iconName, ResourceType.icon, response, downloadProgressCallback)
        if (!response.ok) throw new Error('invalid response')
        return response
      } catch {
        const placeholderUrl = IconFetch.getIconUrl(ICON_PLACEHOLDER_NAME, authorization!)
        const response = await fetchFile(placeholderUrl, this.getFetchOptions(options))
        if (downloadProgressCallback) {
          await handleFetchProgressCallback(ICON_PLACEHOLDER_NAME, ResourceType.icon, response, downloadProgressCallback)
        }
        return response
      }
    }
  }
}
