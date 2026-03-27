import { Logger } from '@hopara/logger'
import {Pool, PoolClient} from 'pg'

export class PoolManager {
  constructor(
    private readonly pool: Pool,
    private readonly logger: Logger,
  ) {
  }

  async close(): Promise<void> {
    this.logger.debug('closing pool')
    await this.pool.end()
  }

  async transaction(executor: (poolClient: PoolClient) => Promise<void>): Promise<void> {
    const poolClient = await this.pool.connect()
    try {
      this.logger.debug('begin transaction')
      await poolClient.query('BEGIN TRANSACTION')
      await executor(poolClient)
      this.logger.debug('commit transaction')
      await poolClient.query('COMMIT TRANSACTION')
    } catch (e) {
      this.logger.debug('rollback transaction')
      await poolClient.query('ROLLBACK TRANSACTION')
      throw e
    } finally {
      await poolClient.release()
    }
  }
}
