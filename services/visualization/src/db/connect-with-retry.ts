import { Logger } from '@hopara/logger'

interface RetryOptions {
  retryAttempts: number
  retryDelayMs: number
}

export async function connectWithRetry<T>(connect: () => Promise<T>,options: RetryOptions, logger: Logger): Promise<T> {
  const { retryAttempts, retryDelayMs } = options

  for (let attempt = 1; attempt <= retryAttempts + 1; attempt++) {
    try {
      const result = await connect()
      if (attempt > 1) {
        logger.info(`connected after ${attempt} attempts`)
      }
      return result
    } catch (error) {
      if (attempt > retryAttempts) {
        logger.error(`failed to connect after ${retryAttempts + 1} attempts`, { error })
        throw error
      }
      logger.warn(`connection attempt ${attempt} failed, retrying in ${retryDelayMs}ms...`, { error })
      await new Promise(resolve => setTimeout(resolve, retryDelayMs))
    }
  }

  throw new Error(`unreachable`)
}
