import {fetchFile} from '@loaders.gl/core'
import {Config} from '@hopara/config'
import * as QueryString from 'query-string'

import {handleFetchProgressCallback} from './Fetch'
import {FetchProgressCallback, FetchResource} from './FetchResource'
import {ResourceHistory} from './ResourceHistory'
import {ResourceType} from './ResourceType'
import {PlaceHolderTypes} from '../placeholder'
import { isNil } from 'lodash'
import { getBaseResourceUrl } from './BaseUrl'

const PLACEHOLDER_NAME = 'placeholder'

export const createHistoryResourceURL = (props: {
  id: string,
  library?: string,
  tenant: string,
  version: number,
  resolution?: string,
  format?: string
  resourceType: ResourceType
}): URL => {
  const {id, library, tenant, version, resolution, format, resourceType} = props
  return new URL(`${getBaseResourceUrl(
    id,
    library,
    tenant,
    resourceType,
  )}/history/${version}?${QueryString.stringify({resolution, format})}`)
}

export const addParam = (url:URL, key: string, value: any) => {
  if (isNil(value)) return
  url.searchParams.append(key, value)
}

export const createResourceURL = (props: {
  id: string,
  library?: string,
  fallback?: string,
  view?: string,
  tenant: string,
  historyStore?: ResourceHistory,
  format?: string
  resolution?: string
  versionDate?: Date
  resourceType: ResourceType
}): URL => {
  const {id, library, tenant, historyStore, format, resolution, versionDate, resourceType, fallback, view} = props
  if (historyStore?.items.length && historyStore?.currentVersion && historyStore.isSame(library, id)) {
    return createHistoryResourceURL({
      id,
      library,
      tenant,
      version: historyStore.currentVersion as number,
      resolution: undefined,
      format,
      resourceType,
    })
  }

  const url = new URL(`${getBaseResourceUrl(id, library, tenant, resourceType)}`)
  addParam(url, 'format', format)
  addParam(url, 'resolution', resolution)
  addParam(url, 'angle', view)
  addParam(url, 'version', versionDate?.getTime().toString())
  if (fallback && fallback !== id) {
    addParam(url, 'fallback', fallback)
  }

  return url
}

export type ResourceFetchParams = {
  id: string
  fallback?: string
  library?: string
  tenant: string
  version?: Date
  webGLMaxTextureSize?: number
  view?: string
}

export abstract class ResourceFetch implements FetchResource {
  protected resourceType: ResourceType
  public abstract getPlaceholder(type: PlaceHolderTypes): any
  protected abstract resolveResolutionParam(url: URL, webGLMaxTextureSize?: number): URL

  private getFormattedURL(fetchParams: ResourceFetchParams, historyStore?: ResourceHistory): URL {
    const {id, fallback, library, tenant, version, webGLMaxTextureSize, view} = fetchParams
    let url = createResourceURL({id, fallback, library, tenant, historyStore, view, resourceType: this.resourceType})
    if (url.protocol === 'data:' || url.href.indexOf(Config.getValue('RESOURCE_API_ADDRESS')) < 0) return url
    url = this.resolveResolutionParam(url, webGLMaxTextureSize)

    if (version) {
      addParam(url, 'version', version.getTime().toString())
    } else if (historyStore?.lastModified) {
      addParam(url, 'version', historyStore.lastModified.getTime().toString())
    }

    return url
  }

  getUrl(fetchParams: ResourceFetchParams, historyStore?: ResourceHistory) {
    const id = fetchParams.id ?? PLACEHOLDER_NAME
    if (fetchParams.id === PLACEHOLDER_NAME) return this.getPlaceholder(PlaceHolderTypes.NOT_FOUND_CANVAS)
    return this.getFormattedURL({...fetchParams, id}, historyStore)
  }

  stillProcessing(response) {
    if (response.status !== 202) return false
    const size = response.headers.get('content-length')
    return Number(size) === 0
  }

  async doFetch(url: string, options?: any, downloadProgressCallback?: FetchProgressCallback, getAbortController?: () => AbortController) {
    try {
      const abortController = getAbortController && getAbortController()
      const response = await fetchFile(url, {...options, signal: abortController?.signal ?? options?.signal})
      if (downloadProgressCallback) await handleFetchProgressCallback(url, this.resourceType, response, downloadProgressCallback)
      if (this.stillProcessing(response)) throw new Error('still processing')
      if (response.status === 404) throw new Error('not found')
      if (!response.ok) throw new Error('invalid model response')
      return response
    } catch (e: any) {
      if (downloadProgressCallback) {
        downloadProgressCallback(url, this.resourceType, undefined)
      }
      if (
        e.message.indexOf('The user aborted a request.') >= 0 ||
        e.message.indexOf('signal is aborted without reason') >= 0
      ) {
        throw new Error(e.message, e.options)
      }

      if (e.message === 'still processing') {
        return await fetchFile(this.getPlaceholder(PlaceHolderTypes.PROCESSING_CANVAS), options)
      }
      return await fetchFile(this.getPlaceholder(PlaceHolderTypes.NOT_FOUND_CANVAS), options)
    }
  }

  fetch(downloadProgressCallback?: FetchProgressCallback, getAbortController?: () => AbortController) {
    return async (url: string, options?: any) => {
      return await this.doFetch(url, options, downloadProgressCallback, getAbortController)
    }
  }
}

