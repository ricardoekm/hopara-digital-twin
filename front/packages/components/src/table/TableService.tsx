import {httpDelete, httpGet, httpPost} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {getRefreshedAuthorization} from '@hopara/auth-front/src/contexts/AuthProvider'
import {Table} from './Table'
import { Queries, Query } from '@hopara/dataset'
import { plainToInstance } from 'class-transformer'

export class TableService {
  async refreshAuthorization(authorization: Authorization) {
    return await getRefreshedAuthorization(authorization)
  }

  async list(authorization: Authorization): Promise<Table[]> {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpGet(
        Config.getValue('DATASET_API_ADDRESS'),
        `/entity-table`,
        {},
        refreshedAuthorization,
        {withCredentials: true},
      )
      return res.data.map((table: any) => new Table({
        name: table.name,
      }))
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async upsert(name: string, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    try {
      const res = await httpPost(Config.getValue('DATASET_API_ADDRESS'),
        `/entity-table/${name}`,
        {},
        {createView: true},
        refreshedAuthorization,
        {withCredentials: true},
      )
      return new Queries(...plainToInstance(Query, res.data.createdViews))
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async delete(tableName: string, authorization: Authorization) {
    const refreshedAuthorization = await this.refreshAuthorization(authorization)
    return httpDelete(
      Config.getValue('DATASET_API_ADDRESS'),
      `/entity-table/${tableName}`,
      {},
      refreshedAuthorization,
      {withCredentials: true},
    )
  }
}
