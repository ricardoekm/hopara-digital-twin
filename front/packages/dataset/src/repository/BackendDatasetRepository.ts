import { Config } from '@hopara/config'
import { Debug } from '@hopara/internals'
import { FilterSet } from '../filter/DatasetFilter'
import { httpDelete, httpGet, httpPost } from '@hopara/http-client'
import { Authorization } from '@hopara/authorization'
import { Query } from '../query/Query'
import { Rows } from '../row/Rows'
import { plainToInstance } from 'class-transformer'
import { Row } from '../row/Row'
import { Column } from '../column/Column'
import { Columns } from '../column/Columns'
import { addId, addIds } from '../service/AddId'
import { DatasetRepository, GetRowsParams } from './DatasetRepository'
import { DatasetFilters } from '../filter/DatasetFilters'
import { GetRowsResponse } from '../service/GetRowsResponse'

export const addParam = (
  queryParam: Record<string, any>,
  key: string,
  value?: any
): void => {
  if (value) {
    // Dont send empty array
    if (Array.isArray(value) && value.length > 0) {
      queryParam[key] = value
    } else {
      queryParam[key] = value
    }
  }
}

const getFilterParams = (filterSet?: FilterSet): Record<string, any> => {
  const queryParams: any = {}
  if (!filterSet) return queryParams

  addParam(queryParams, 'filter', filterSet.filters)
  addParam(queryParams, 'limit', filterSet.limit)
  addParam(queryParams, 'offset', filterSet.offset)

  return queryParams
}

export class BackendDatasetRepository implements DatasetRepository {
  private processRowsResponse(body: any, headers: any, query: Query) {
    const rows = new Rows()
    body.rows.forEach((row: Row) => rows.push(new Row(row)))
    rows.setEtagValue(headers.get('ETag'))

    if (body.columns?.length) {
      const columns = plainToInstance(Column, body.columns as any[])
      rows.setColumns(new Columns(...columns))
    }

    if (query.getColumns().hasPrimaryKey()) {
      addIds(rows, query.getColumns().getPrimaryKey() as any)
    }

    const lastPageHeader = headers.get('last-page')

    return {
      rows,
      lastPage: lastPageHeader !== 'false'
    }
  }

  async getRows(params: GetRowsParams): Promise<GetRowsResponse> {
    const queryParams = getFilterParams(params.filterSet)
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', params.query.dataSource)
    addParam(queryParams, 'transform', params.transformParams)
    addParam(queryParams, 'distanceSort', params.distanceSort)
    if (params.calculateStats) addParam(queryParams, 'calculateStats', true)

    const response = await httpGet(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${params.query.name}/row`,
      queryParams,
      params.authorization,
      {
        progressCallback: params.downloadProgressCallback,
        withCredentials: true
      }
    )
    const body = await response.data
    return this.processRowsResponse(body, response.headers, params.query)
  }

  async search(
    query: Query,
    term: string | undefined,
    filter: FilterSet,
    authorization: Authorization
  ): Promise<GetRowsResponse> {
    const queryParams = getFilterParams(filter)
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', query.dataSource)
    addParam(queryParams, 'term', term)

    const response = await httpGet(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${query.name}/search`,
      queryParams,
      authorization,
      { withCredentials: true }
    )
    const body = await response.data
    return this.processRowsResponse(body, response.headers, query)
  }

  async getRow(
    rowId: string,
    query: Query,
    filters: DatasetFilters,
    authorization: Authorization
  ): Promise<any> {
    const queryParams = {}
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', query.dataSource)
    addParam(queryParams, 'filter', filters)

    const response = await httpGet(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${query.name}/row/${encodeURIComponent(rowId)}`,
      queryParams,
      authorization,
      { withCredentials: true }
    )
    if (response.status !== 200) {
      throw new Error('Error getting row ' + response.status)
    }
    const row = new Row(response.data)
    addId(row, query.getPrimaryKey()?.getName())
    return row
  }

  async updateRow(
    query: Query,
    rowId: string,
    rowValues: any,
    filters: DatasetFilters,
    authorization: Authorization
  ): Promise<any> {
    const queryParams = {}
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', query.dataSource)
    addParam(queryParams, 'filter', filters)

    const response = await httpPost(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${query.name}/row/${encodeURIComponent(rowId)}`,
      rowValues,
      queryParams,
      authorization,
      { withCredentials: true }
    )
    if (response.status !== 200) {
      throw new Error('Error updating row ' + response.status)
    }

    return response.data
  }

  async createRow(
    row: Partial<Row> = {},
    query: Query,
    authorization: Authorization
  ): Promise<any> {
    const queryParams = {}
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', query.dataSource)

    const response = await httpPost(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${query.name}/row`,
      [row],
      queryParams,
      authorization
    )
    if (response.status !== 200) {
      throw new Error('Error updating row ' + response.status)
    }

    return response.data
  }

  async deleteRow(
    rowId: string,
    query: Query,
    authorization: Authorization
  ): Promise<any> {
    const queryParams = {}
    if (Debug.isDebugging()) queryParams['debug'] = true
    addParam(queryParams, 'dataSource', query.dataSource)

    const response = await httpDelete(
      Config.getValue('DATASET_API_ADDRESS'),
      `view/${query.name}/row/${encodeURIComponent(rowId)}`,
      queryParams,
      authorization
    )
    if (response.status !== 200) {
      throw new Error('Error deleting row ' + response.status)
    }

    return response.data
  }
}
