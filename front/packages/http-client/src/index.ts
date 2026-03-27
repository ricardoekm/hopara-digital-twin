import queryString from 'query-string'
import axios, {AxiosProgressEvent, RawAxiosRequestConfig} from 'axios'
import {i18n} from '@hopara/i18n'
import { Authorization } from '@hopara/authorization'
import axiosRetry from 'axios-retry'
import { objectsToString } from './ObjectsToString'

axiosRetry(axios, { retries: 1, retryDelay: () => 1000})
export type OnUploadFunction = (p: AxiosProgressEvent) => void

export class HttpError extends Error {
  responseData?: any
  status?: number
  context?: any
  constructor(error: any) {
    super()
    Object.assign(this, error)
    this.message = this.getErrorMessage(error)
    this.name = this.message
    this.cause = error.response?.data
    this.status = error.response?.status
    this.context = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.response?.headers,
      source: 'http',
    }
  }

  private getErrorMessage(error: any): string {
    return error?.response?.data?.message ?? error?.message ?? error?.response?.statusText ?? error?.name ?? i18n('UNKNOWN_ERROR')
  }
}

export class NotFoundError extends HttpError {
}

function getConfigFromOptions(options?: HttpOptions | GetOptions) {
  const config = {}
  if (options?.withCredentials) {
    config['withCredentials'] = true
  }

  if (options?.parseResponse === false) {
    config['responseType'] = 'text'
  }

  if (options?.timeout) {
    config['timeout'] = options.timeout
  }

  return config
}

const formatRequestUrl = (url: string) => {
  return url.replaceAll('#', '%23')
}

async function tryFetch(href, config: RawAxiosRequestConfig, options?: HttpOptions | GetOptions): Promise<any> {
  try {
    const optionsConfig = getConfigFromOptions(options)
    return await axios.request({
      ...config,
      url: formatRequestUrl(href),
      ...optionsConfig,
    })
  } catch (e: any) {
    if (e.response?.status === 401) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new HttpError(e))
        }, 1000)
      })
    } else if (e.response?.status === 404) {
      throw new NotFoundError(e)
    }

    throw new HttpError(e)
  }
}

export type HttpOptions = {
  headers?: Record<string, string>,
  withCredentials?: boolean
  parseResponse?: boolean
  timeout?: number
}

export type GetOptions = {
  progressCallback?: (progress: number) => void,
  headers?: Record<string, string>,
  parseResponse?: boolean,
  withCredentials?: boolean
  timeout?: number
}

export async function httpGet(
  endpoint: string,
  resource: string,
  queryParams: Record<string, any> = {},
  authorization?: Authorization,
  options: GetOptions = {},
) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authorization?.toHTTPHeaders(), options.headers)
  const url = new URL(resource, endpoint)
  url.search = queryString.stringify(objectsToString(queryParams))

  let onDownloadProgress: undefined | ((progressEvent: AxiosProgressEvent) => void) = undefined
  if (options.progressCallback) {
    onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0))
      if (options.progressCallback) {
        return options.progressCallback(progress)
      }
    }
  }

  return tryFetch(url.href, {headers, onDownloadProgress}, options)
}

export async function httpPost(
  endpoint: string,
  resource: string,
  body = {},
  queryParams: Record<string, any> = {},
  authorization?: Authorization,
  options: HttpOptions = {},
) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authorization?.toHTTPHeaders(), options.headers)
  const url = new URL(resource, endpoint)
  url.search = queryString.stringify(objectsToString(queryParams))

  const axiosConfig = {
    method: 'POST',
    headers,
    data: JSON.stringify(body),
  }

  return tryFetch(url.href, axiosConfig, options)
}


export async function httpPut(
  endpoint: string,
  resource: string,
  body = {},
  queryParams: Record<string, any> = {},
  authorization?: Authorization,
  options: HttpOptions = {},
) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authorization?.toHTTPHeaders(), options.headers)
  const url = new URL(resource, endpoint)
  url.search = queryString.stringify(objectsToString(queryParams))

  const axiosConfig = {
    method: 'PUT',
    headers,
    data: JSON.stringify(body),
  }
  return tryFetch(url.href, axiosConfig, options)
}

export async function httpPatch(endpoint: string, 
                                resource: string, body = {}, 
                                queryParams: Record<string, any> = {},
                                authorization?: Authorization,
                                options: HttpOptions = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authorization?.toHTTPHeaders(), options.headers)
  const url = new URL(resource, endpoint)
  url.search = queryString.stringify(objectsToString(queryParams))

  const axiosConfig = {
    method: 'PATCH',
    headers,
    data: JSON.stringify(body),
  }
  return tryFetch(url.href, axiosConfig)
}

export async function httpPutFormData(
  endpoint: string,
  resource: string,
  formData: FormData | undefined,
  authorization?: Authorization,
  onUploadProgress?: OnUploadFunction,
  options: HttpOptions = {},
) {
  const headers = Object.assign({}, authorization?.toHTTPHeaders(), options?.headers)
  const url = new URL(resource, endpoint)

  const axiosConfig = {
    method: 'PUT',
    headers,
    data: formData,
    onUploadProgress,
  }
  return tryFetch(url.href, axiosConfig, options)
}

export async function httpPostFormData(
  endpoint: string,
  resource: string,
  formData: FormData | undefined,
  authorization?: Authorization,
  onUploadProgress?: OnUploadFunction,
  options: HttpOptions = {},
) {
  const headers = Object.assign({}, authorization?.toHTTPHeaders(), options?.headers)
  const url = new URL(resource, endpoint)

  const axiosConfig = {
    method: 'POST',
    headers,
    data: formData,
    onUploadProgress,
  }
  return tryFetch(url.href, axiosConfig)
}

export async function httpDelete(endpoint: string, resource: string,
                                 queryParams: Record<string, any> = {},
                                 authorization?: Authorization,
                                 options: HttpOptions = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, authorization?.toHTTPHeaders(), options.headers)
  const url = new URL(resource, endpoint)
  url.search = queryString.stringify(objectsToString(queryParams))

  const axiosConfig = {
    method: 'DELETE',
    headers,
  }
  return tryFetch(url.href, axiosConfig, options)
}
