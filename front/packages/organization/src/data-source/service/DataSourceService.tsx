import {DataSource} from '../DataSource'
import {httpDelete, httpGet, httpPut} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import { getRefreshedAuthorization } from '@hopara/auth-front/src/contexts/AuthProvider'
import { isNil } from 'lodash'

export class DataSourceService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  async list(authorization: Authorization, timeout?: number): Promise<DataSource[]> {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    const options = { withCredentials: true }
    if (!isNil(timeout)) {
      options['timeout'] = timeout
    }
    try {
      const res = await httpGet(Config.getValue('DATASET_API_ADDRESS'),
        '/data-source',
        {},
        refreshedAuthorization,
        options)
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async upsert(dataSource: DataSource, authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpPut(Config.getValue('DATASET_API_ADDRESS'),
        `/data-source/${dataSource.name}`,
        dataSource,
        {},
        refreshedAuthorization,
        { withCredentials: true })
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async test(dataSource: DataSource, authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpPut(Config.getValue('DATASET_API_ADDRESS'), `/data-source/${dataSource.name}`,
        dataSource,
        {persist: false},
        refreshedAuthorization,
        { withCredentials: true })
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async delete(id: string, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    return httpDelete(Config.getValue('DATASET_API_ADDRESS'),
      '/data-source/' + id,
      {},
      refreshedAuthorization,
      { withCredentials: true })
  }

  async get(requestName: string | undefined, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpGet(Config.getValue('DATASET_API_ADDRESS'),
        `/data-source/${requestName}`,
        {},
        refreshedAuthorization,
        {
          withCredentials: true,
        })
      return res.data
    } catch (err: any) {
      throw err.message ? err : new Error(i18n('UNKNOWN_ERROR'))
    }
  }
}
