import {AxiosInstance} from 'axios'

import {Logger} from '@hopara/logger'
import {UserInfo} from '@hopara/http-server'
import { ColumnsMap } from '../data/ColumnsMap.js'
import { QueryKeys } from '../data/QueryKeys.js'
import { QueryKey } from '../data/QueryKey.js'
import { constantCase } from 'change-case'
import { Columns } from '../data/query/Columns.js'

export type DatasetConfig = {
  url: string
}

export class DatasetRepository {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly datasetConfig: DatasetConfig,
    private readonly logger: Logger,
  ) {
  }

  getDatasetTransform(transform:string) : string {
    return constantCase(transform)
  }

  getQueryColumnsUrl(key:QueryKey): string {
    if ( key.transform ) {
      return `${this.datasetConfig.url}/view/${encodeURIComponent(key.query)}/transform/${this.getDatasetTransform(key.transform)}/column`
    } else {
      return `${this.datasetConfig.url}/view/${encodeURIComponent(key.query)}/column`
    }
  }

  async getQueryColumns(key:QueryKey, userInfo: UserInfo): Promise<Columns | null> {
    try {
      this.logger.debug('getting query columns', {key: key.getId()})
      const headers = {'Authorization': userInfo.authorization} as any
      if (userInfo.tenant) {
        headers['tenant'] = userInfo.tenant
      }

      const res = await this.httpClient.request({
        headers,
        method: 'GET',
        url: this.getQueryColumnsUrl(key),
        params: {
          dataSource: key.source,
          fullResponse: true,
        },
      })
      return res.data
    } catch (e) {
      this.logger.error('can not get query columns', {key: key.getId(), cause: (e as any).message, response: (e as any).response?.data})
      return null
    }
  }

  async getColumns(keys: QueryKeys, userInfo: UserInfo): Promise<ColumnsMap> {
    keys = keys.complete().unique()
    const requests = keys.map((key:QueryKey) => {
      return this.getQueryColumns(key, userInfo)
    })

    const responses = await Promise.all(requests)
    const columnsMap = new ColumnsMap()
    responses.forEach((response, i) => {
      const columns = response ? new Columns(...response) : new Columns()
      columnsMap.add(keys[i], columns)
    })

    return columnsMap
  }

  getQueryUrl(key:QueryKey): string {
    return `${this.datasetConfig.url}/view/${encodeURIComponent(key.query)}`
  }

  async validateQueryKey(queryKey:QueryKey, userInfo: UserInfo): Promise<any | null> {
    try {
      this.logger.debug('getting query', {query: queryKey.getPath()})
      this.logger.debug('getting tenant', {tenant: userInfo.tenant})

      const headers = {'Authorization': userInfo.authorization} as any
      if (userInfo.tenant) {
        headers['tenant'] = userInfo.tenant
      }

      await this.httpClient.request({
        headers,
        method: 'GET',
        url: this.getQueryUrl(queryKey),
        params: {
          dataSource: queryKey.source,
        },
      })

      return queryKey
    } catch (e) {
      this.logger.error('can not get query', {query: queryKey.getPath(), cause: (e as any).message, response: (e as any).response?.data})
      return null
    }
  }

  async getValidQueryKeys(queryKeys: QueryKeys, userInfo: UserInfo): Promise<QueryKeys> {
    queryKeys = queryKeys.complete().unique()
    const requests = queryKeys.map((queryKey) => {
      return this.validateQueryKey(queryKey, userInfo)
    })

    const responses = await Promise.all(requests)
    const validItems = responses.filter((response) => !!response)
    return new QueryKeys(...validItems).unique()
  }
}
