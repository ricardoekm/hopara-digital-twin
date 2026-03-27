import fs from 'fs'
import cfg from 'config'
import {LoggerConfig} from '@hopara/logger'
import pg from 'pg'

const {version} = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const moduleVersion = `${version}${process.env.BUILD_NUMBER ? '+' + process.env.BUILD_NUMBER : ''}`

export type Config = {
  server: {
    port: number,
  },
  database: pg.PoolConfig & {
    retryAttempts: number,
    retryDelayMs: number,
  },
  logger: LoggerConfig,
  auth: {
    enabled: boolean
    jwtIssuer: string,
    jwksUri: string
  },
  version: string,
  dataset: {
    url: string
  },
  notification: {
    url: string
  },
  template: {
    url: string
  },
  tenant: {
    url: string
  }
}

export const config: Config = {
  server: {
    ...cfg.get('server'),
    port: Number(cfg.get('server.port')),
  },
  logger: cfg.get('logger'),
  database: {
    ...cfg.get('database'),
    port: Number(cfg.get('database.port')),
    max: Number(cfg.get('database.poolMax')),
    min: Number(cfg.get('database.poolMin')),
    connectionTimeoutMillis: Number(cfg.get('database.connectionTimeoutMillis')),
    idleTimeoutMillis: Number(cfg.get('database.idleTimeoutMillis')),
    retryAttempts: Number(cfg.get('database.retryAttempts')),
    retryDelayMs: Number(cfg.get('database.retryDelayMs')),
  },
  notification: cfg.get('notification'),
  auth: {
    ...cfg.get('auth'),
    enabled: cfg.get('auth.enabled') !== false,
  },
  version: moduleVersion,
  dataset: cfg.get('dataset'),
  tenant: cfg.get('tenant'),
  template: cfg.get('template'),
}
