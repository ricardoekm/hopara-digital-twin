import {TenantUserBasedTable} from '../../db/tenant-user-based-table.js'
import {VisualizationEntity} from './visualization-entity.js'
import {PoolClient} from 'pg'
import {PoolManager} from '../../db/pool-manager.js'
import {BadRequestError, UserInfo} from '@hopara/http-server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import {Visualization} from '../domain/Visualization.js'

dayjs.extend(utc)

export interface SaveVisualizationResult {
  visualization: Visualization,
  version: number
}

export default class VisualizationRepository {
  constructor(
    private readonly table: TenantUserBasedTable<VisualizationEntity>,
    private readonly historyTable: TenantUserBasedTable<VisualizationEntity>,
    private readonly poolManager: PoolManager,
  ) {
  }

  async upsert(visualization: Visualization, userInfo: UserInfo): Promise<SaveVisualizationResult> {
    if (!visualization.$schema) {
      throw new BadRequestError('Cannot upsert an visualization with no schema')
    }
    const entity = VisualizationEntity.fromDomain(visualization)
    const where = {id: entity.id}
    let version = 1
    await this.poolManager.transaction(async (poolClient) => {
      const dbApp = await this.table.findOne({where}, userInfo, poolClient)
      if (!dbApp) {
        entity.version = version
        await this.table.insert(entity, userInfo, poolClient)
      } else {
        version = dbApp.version + 1
        entity.version = version
        await this.table.update({where, partialEntity: entity}, userInfo, poolClient)
      }
      entity.edited_by = userInfo.email
      entity.edited_at = dayjs.utc().toISOString()
      await this.historyTable.insert(entity, userInfo, poolClient)
    })
    return {visualization: entity.toDomain(), version}
  }

  async get(appId: string, userInfo: UserInfo, poolClient?: PoolClient): Promise<Visualization | undefined> {
    const visualization = await this.table.findOne(
      {where: {id: appId}},
      userInfo,
      poolClient
    )
    if (!visualization) {
      return
    }
    return visualization.toDomain()
  }

  async exists(appId: string, userInfo: UserInfo, poolClient?: PoolClient): Promise<boolean> {
    return this.table.exists(
      {where: {id: appId}},
      userInfo,
      poolClient
    )
  }

  async list(group: string | undefined, userInfo: UserInfo, poolClient?: PoolClient): Promise<Array<any>> {
    let visualizations = [] as any

    try {
      visualizations = await this.table.find(
        {
          order: {name: 'asc'},
          select: ['name', 'id', 'schema', 'version', 'visualizations'],
        },
        userInfo,
        poolClient
      )
    } catch (e: any) {
      if (e.code === '42P01') {
        throw new BadRequestError('This organization was not configured yet. Please contact the support.')
      }
    }
    visualizations = visualizations.map((visualization) => {
      let vis = {} as any
      try {
        vis = JSON.parse(visualization.visualizations)
      } catch {
        // do nothing
      }
      return {
        id: visualization.id,
        name: visualization.name,
        group: vis.group,
        type: vis.type,
      }
    })

    if (group) {
      visualizations = visualizations.filter((visualization) => {
        if (group === 'USER') {
          return visualization.group === 'USER' || !visualization.group
        } else {
          return visualization.group === group
        }
      })
    }

    return visualizations
  }

  async delete(appId: string, userInfo: UserInfo): Promise<boolean> {
    let deleted: { affected: number } = {affected: 0}
    await this.poolManager.transaction(async (poolClient) => {
      deleted = await this.table.delete(
        {where: {id: appId}},
        userInfo,
        poolClient,
      )
      await this.historyTable.delete({where: {id: appId}}, userInfo, poolClient)
    })
    return Number(deleted.affected) > 0
  }

  async listHistory(appId: string, userInfo: UserInfo): Promise<{
    version: number,
    editedBy: string,
    editedAt: Date
  }[]> {
    const rows = await this.historyTable.find(
      {
        where: {id: appId},
        order: {version: 'desc'},
        limit: 30,
      },
      userInfo,
    )
    return rows.map((row) => ({
      version: row.version,
      editedBy: row.edited_by,
      editedAt: row.edited_at,
    }))
  }

  async rollback(appId: string, version: number, userInfo: UserInfo): Promise<SaveVisualizationResult> {
    const where = {id: appId, version}
    const entity = await this.historyTable.findOne({where}, userInfo)
    if (!entity) {
      throw new Error('Not implemented')
    }
    const visualization = entity.toDomain()
    return this.upsert(visualization, userInfo)
  }

  async getVersion(appId: string, version: number, userInfo: UserInfo): Promise<Visualization | null> {
    const where = {id: appId, version}
    const visualization = await this.historyTable.findOne({where}, userInfo)
    if (!visualization) {
      return null
    }
    return visualization.toDomain()
  }
}
