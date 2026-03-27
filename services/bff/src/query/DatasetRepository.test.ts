import {Repository as DatasetRepository} from './DatasetRepository'
import {Column} from './Column'
import {existsSync, readFile} from 'fs'
import { Authorization } from '../authorization'
import { Queries, QueryKey } from './Query'

class DatasetRepositoryStub implements DatasetRepository {
  getColumns(queryKey: QueryKey, authorization:Authorization): Promise<any> {
    return new Promise((resolve) => {
      const file = __dirname + `/test-resources/${queryKey.name}-columns.json`
      if (!existsSync(file)) return resolve(null)
      readFile(file, (err, data) => {
        if (err) return authorization
        resolve(JSON.parse(data.toString()))
      })
    })
  }

  getColumnValue(queryKey: QueryKey, fieldName: string, filterTerm?: string): Promise<any> {
    return new Promise((resolve) => {
      const file = __dirname + `/test-resources/${queryKey.name}-${fieldName}-${filterTerm ? filterTerm + '-' : ''}column-value.json`
      if (!existsSync(file)) return resolve(null)
      readFile(file, (err, data) => {
        if (err) return null
        resolve(JSON.parse(data.toString()))
      })
    })
  }

  getQueries(queryKeys: QueryKey[], authorization: Authorization): Promise<Queries> {
    return new Promise((resolve) => {
      Promise.all(queryKeys.map((queryKey) => {
        return this.getColumns({name: queryKey.name, dataSource: queryKey.dataSource}, authorization)
      })).then((queryColumns) => {
        return resolve(new Queries(...queryKeys.map((queryKey, index) => {
          const columns: Column[] = queryColumns[index] ?? []
          return {
            name: queryKey.name,
            dataSource: queryKey.dataSource,
            columns,
            writeLevel: 'NONE',
            writeColumns: [],
            transforms: [],
          }
        })))
      })
    })
  }

  getAllQueries(authorization:Authorization): Promise<Queries> {
    const queryKeys = [{name: 'any-query-name', dataSource: 'any-ds'}]
    return new Promise((resolve) => {
      Promise.all(queryKeys.map((queryKey) => {
        return this.getColumns(queryKey, authorization)
      })).then((viewColumns) => {
        return resolve(new Queries(...queryKeys.map((queryKey, index) => {
          const columns: Column[] = viewColumns[index] ?? []
          return {
            name: queryKey.name,
            dataSource: queryKey.dataSource,
            columns,
            writeLevel: 'NONE',
            writeColumns: [],
            transforms: [],
          }
        })))
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveQuery(queryKey: QueryKey, queryData: any, authorization:Authorization): Promise<void> {
    return new Promise((resolve) => resolve())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  runScript(id: string, authorization:Authorization): Promise<void> {
    return new Promise((resolve) => resolve())
  }

  getRows(): Promise<{rows: [], columns: []}> {
    return new Promise((resolve) => {
      resolve({rows: [], columns: []})
    })
  }
}

export const getDatasetRepositoryStub = (): DatasetRepository => new DatasetRepositoryStub() as any

it('should get the column value', async () => {
  const repository = getDatasetRepositoryStub()
  const columnValue = await repository.getColumnValue({name: 'any-query-name', dataSource: 'any-ds'}, 'any-field-name') as any
  expect(columnValue.length).toEqual(6)
})

it('should get filtered column value', async () => {
  const repository = getDatasetRepositoryStub()
  const columnValue = await repository.getColumnValue({name: 'any-query-name', dataSource: 'any-ds'}, 'any-field-name', 'any-filter-term') as any
  expect(columnValue.length).toEqual(3)
})
