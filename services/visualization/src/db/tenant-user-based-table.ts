import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity.js'
import {Pool, PoolClient, QueryResult} from 'pg'
import {Logger} from '@hopara/logger'
import {DeleteOptions, FindManyOptions, FindOptions, QueryBuilder} from './query-builder.js'
import {FindOptionsWhere} from 'typeorm'
import {UserInfo} from '@hopara/http-server'

export class TenantUserBasedTable<T> {
  private readonly tableName: string
  private readonly Entity: { new(): T }
  private readonly logger: Logger
  private readonly pool: Pool

  constructor(props: {
    tableName: string,
    Entity: { new(): T },
    logger: Logger,
    pool: Pool,
  }) {
    this.tableName = props.tableName
    this.Entity = props.Entity
    this.logger = props.logger
    this.pool = props.pool
  }

  private async runQuery(query: string, poolClient?: PoolClient): Promise<QueryResult> {
    this.logger.debug(query)

    if (poolClient) {
      return poolClient.query(query)
    }

    const client = await this.pool.connect()
    try {
      return client.query(query)
    } finally {
      client.release()
    }
  }

  async findOne({where}: FindOptions<T>, userInfo: UserInfo, poolClient?: PoolClient): Promise<any | undefined> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.findOne({where})
    const result = await this.runQuery(query, poolClient)
    const dbObj = result.rows.length ? result.rows[0] : undefined
    if (dbObj) {
      const entity = new this.Entity() as any
      Object.keys(dbObj).forEach((key) => {
        entity[key] = dbObj[key]
      })
      return entity
    }
  }

  async find(options: FindManyOptions<T>, userInfo: UserInfo, poolClient?: PoolClient): Promise<any[]> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.find(options)
    const result = await this.runQuery(query, poolClient)
    return result.rows.map((row) => {
      const entity = new this.Entity() as any
      Object.keys(row).forEach((key) => {
        entity[key] = row[key]
      })
      return entity
    })
  }

  async update(options: {
                 where: FindOptionsWhere<T>,
                 partialEntity: QueryDeepPartialEntity<T>,
               },
               userInfo: UserInfo,
               poolClient?: PoolClient,
  ): Promise<{ updated: number }> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.update(options)
    const res = await this.runQuery(query, poolClient)
    return {updated: res.rowCount}
  }

  async insert(
    entity: QueryDeepPartialEntity<T>,
    userInfo: UserInfo,
    poolClient?: PoolClient,
  ): Promise<void> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.insert(entity)
    await this.runQuery(query, poolClient)
  }

  async count(options: FindOptions<T>, userInfo: UserInfo, poolClient?: PoolClient): Promise<number> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.count(options)
    const result = await this.runQuery(query, poolClient)
    return Number(result.rows[0].count)
  }

  async exists(options: FindOptions<T>, userInfo: UserInfo, poolClient?: PoolClient): Promise<boolean> {
    const count = await this.count(options, userInfo, poolClient)
    return count > 0
  }

  async delete(options: DeleteOptions<T>, userInfo: UserInfo, poolClient?: PoolClient): Promise<{ affected: number }> {
    const queryBuilder = new QueryBuilder(userInfo, this.tableName)
    const query = queryBuilder.delete(options)
    const result = await this.runQuery(query, poolClient)
    return {affected: result.rowCount}
  }
}
