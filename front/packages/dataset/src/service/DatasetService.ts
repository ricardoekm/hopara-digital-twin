import { Authorization } from '@hopara/authorization'
import { FilterSet } from '../filter/DatasetFilter'
import { Query } from '../query/Query'
import { BackendDatasetRepository } from '../repository/BackendDatasetRepository'
import { GetRowsResponse } from './GetRowsResponse'
import { DatasetRepository, GetRowsParams } from '../repository/DatasetRepository'
import { omit } from 'lodash/fp'
import { createScopeFilters } from '../row/Scope'
import { Row } from '../row/Row'
import { createIndexedRowsById } from '../row/IndexedRows'
import { Rows } from '../row/Rows'

export class DatasetService {
  datasetRepository: DatasetRepository
  backendDatasetRepository: BackendDatasetRepository

  constructor(datasetRepository?: DatasetRepository) {
    this.datasetRepository = datasetRepository ?? new BackendDatasetRepository()
    this.backendDatasetRepository = new BackendDatasetRepository()
  }

  async getRows(params: GetRowsParams & { positionQuery?: Query }): Promise<GetRowsResponse> {
    if (!params.positionQuery || params.query.getId() === params.positionQuery.getId()) {
      return await this.datasetRepository.getRows(params)
    } else {
      const dataRowsPromise = this.datasetRepository.getRows(params)
      const positionRowsPromise = this.backendDatasetRepository.getRows({
        ...params,
        query: params.positionQuery
      })

      const [dataRows, positionRows] = await Promise.all([
        dataRowsPromise,
        positionRowsPromise
      ])
      const indexedPositionRows = createIndexedRowsById(
        positionRows?.rows || new Rows()
      )
      const mergedRows = dataRows?.rows?.merge(indexedPositionRows) || new Rows()
      return { rows: mergedRows, lastPage: dataRows.lastPage }
    }
  }

  async search(
    query: Query,
    positionQuery: Query,
    term: string | undefined,
    filterSet: FilterSet,
    authorization: Authorization
  ): Promise<GetRowsResponse> {
    if (query.getId() === positionQuery.getId()) {
      const searchRows = await this.datasetRepository.search(
        query,
        term,
        filterSet,
        authorization
      )
      return { rows: searchRows.rows, lastPage: searchRows.lastPage }
    } else {
      // We can`t limit the position query, because the order may not match with the data query
      const unlimitedFilter = omit(['limit', 'offset'], filterSet)
      const positionRowsPromise = this.backendDatasetRepository.getRows({
        query: positionQuery,
        filterSet: unlimitedFilter,
        authorization
      })

      const searchRowsPromise = this.datasetRepository.search(
        query,
        term,
        filterSet,
        authorization
      )

      const [response, datasetResponse] = await Promise.all([
        searchRowsPromise,
        positionRowsPromise
      ])

      const indexedRows = createIndexedRowsById(
        datasetResponse?.rows ? datasetResponse.rows : new Rows()
      )
      const rows = response.rows?.merge(indexedRows) ?? new Rows()
      return { rows, lastPage: response.lastPage }
    }
  }

  async getRow(
    rowId: string,
    query: Query,
    scope: string | undefined,
    authorization: Authorization
  ): Promise<any> {
    const row = await this.backendDatasetRepository.getRow(
      rowId,
      query,
      createScopeFilters(scope),
      authorization
    )
    const rowIdColumn = query.getColumns().getPrimaryKey()
    if (rowIdColumn) {
      row['_id'] = row[rowIdColumn.name]
    }
    return new Row(row)
  }

  async updateRow(
    query: Query,
    rowId: string,
    rowValues: any,
    scope: string | undefined,
    authorization: Authorization
  ): Promise<any> {
    return this.backendDatasetRepository.updateRow(
      query,
      rowId,
      rowValues,
      createScopeFilters(scope),
      authorization
    )
  }

  async createRow(
    row: Record<string, any>,
    query: Query,
    authorization: Authorization
  ): Promise<any> {
    return this.backendDatasetRepository.createRow(row, query, authorization)
  }

  async deleteRow(
    rowId: string,
    query: Query,
    authorization: Authorization
  ): Promise<any> {
    return this.backendDatasetRepository.deleteRow(rowId, query, authorization)
  }
}
