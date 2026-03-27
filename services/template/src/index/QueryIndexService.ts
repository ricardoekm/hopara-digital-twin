import { AxiosInstance } from 'axios'
import { Query } from '../query/Query'
import { QueryService } from '../query/QueryService'
import { isEmpty } from 'lodash'

export type DatasetConfig = {
  url: string
}

export class QueryIndexService {
  constructor(private readonly httpClient: AxiosInstance,
              private readonly datasetConfig: DatasetConfig,
              private readonly queryService: QueryService

  ) {}

  async index(templateId: string, queryName: string, tenant: string, authorization: string) {
    const query = await this.queryService.get(templateId, queryName) as Query
    const headers = { Authorization: authorization, tenant }
      const url = new URL(`/view/${query.name}`, this.datasetConfig.url)
      const res = await this.httpClient.request({
        method: 'POST',
        url: url.href,
        data: query,
        headers
      })
      return res.data
  }

  async indexQueries(queries: string[] | undefined, templateId: string, tenant: string, authorization: string) {
    if (!isEmpty(queries)) {
      const positionQueries = queries!.filter((q) => q.endsWith('_pos'))
      const positionQueriesPromises = []
      for (const positionQuery of positionQueries) {
        const promise = this.index(templateId, positionQuery, tenant, authorization)
        positionQueriesPromises.push(promise)
      }
      await Promise.all(positionQueriesPromises)

      const regularQueries = queries!.filter((q) => !q.endsWith('_pos'))
      const regularQueriesPromises = []
      for (const regularQuery of regularQueries) {
        const promise = this.index(templateId, regularQuery, tenant, authorization)
        regularQueriesPromises.push(promise)
      }
      
      await Promise.all(regularQueriesPromises)
    }
  }
}
