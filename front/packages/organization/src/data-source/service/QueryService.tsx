import {httpDelete, httpGet, httpPost} from '@hopara/http-client'
import {Config} from '@hopara/config'
import {Authorization} from '@hopara/authorization'
import {i18n} from '@hopara/i18n'
import {Query} from '../Query'

export class QueryService {
  async list(dataSourceName: string | undefined, authorization: Authorization): Promise<Query[]> {
    try {
      const res = await httpGet(
        Config.getValue('DATASET_API_ADDRESS'),
        `/view`,
        {
          dataSource: dataSourceName,
        },
        authorization,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async get(queryName: string, dataSourceName: string, authorization: Authorization): Promise<Query> {
    try {
      const res = await httpGet(
        Config.getValue('DATASET_API_ADDRESS'),
        `/view/${queryName}`,
        {dataSource: dataSourceName},
        authorization,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw err.message ? err : new Error(i18n('UNKNOWN_ERROR'))
    }
  }

  async upsert(query: Query, authorization: Authorization, fillPrimaryKey = false) {
    try {
      await httpPost(
        Config.getValue('DATASET_API_ADDRESS'),
        `/view/${query.name}`,
        query,
        {
          fillPrimaryKey,
        },
        authorization,
        { withCredentials: true },
      )
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async run(query: Query, authorization: Authorization) {
    try {
      const res = await httpPost(
        Config.getValue('DATASET_API_ADDRESS'),
        `/query`,
        query,
        {},
        authorization,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  delete(query: Query, authorization: Authorization) {
    return httpDelete(
      Config.getValue('DATASET_API_ADDRESS'),
      '/view/' + query.name,
      {
        dataSource: query.dataSource,
      },
      authorization,
      { withCredentials: true },
    )
  }

  async getMetadata(dataSource: any, query: string, authorization: Authorization) {
    try {
      const res = await httpPost(
        Config.getValue('DATASET_API_ADDRESS'),
        `/query-metadata`,
        {dataSource, query},
        {},
        authorization,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }

  async validate(query: Query, authorization: Authorization) {
    try {
      const res = await httpPost(
        Config.getValue('DATASET_API_ADDRESS'),
        `/validate-query`,
        query,
        {},
        authorization,
        { withCredentials: true },
      )
      return res.data
    } catch (err: any) {
      throw new Error(err?.message ?? i18n('UNKNOWN_ERROR'))
    }
  }
}
