import {LoggerConfig} from '@hopara/logger'

process.env['NODE_CONFIG_DIR'] = __dirname
import cfg from 'config'
import {version} from '../../package.json'
const moduleVersion = `${version}${process.env.BUILD_NUMBER ? '+' + process.env.BUILD_NUMBER : ''}`

// So typescript copies it on build
import hack1 from './default.json'
import hack2 from './custom-environment-variables.json'
export {hack1, hack2}

export type Config = {
  server: {
    port: number
  }
  logger: LoggerConfig
  version: string
  fs: {
    basePath: string
  }
  dataset: {
    url: string
  },
  resource: {
    url: string
  },
  auth: {
    enabled: boolean
    jwtIssuer: string,
    jwksUri: string
  },
  imageIndex: {
    batchSize: number
  },
}

export const config: Config = {
  server: {
    ...cfg.get('server'),
    port: Number(cfg.get('server.port')),
  },
  logger: cfg.get('logger'),
  version: moduleVersion,
  dataset: cfg.get('dataset'),
  resource: cfg.get('resource'),
  auth: {
    ...cfg.get('auth'),
    enabled: cfg.get('auth.enabled') !== false,
  },
  fs: cfg.get('fs'),
  imageIndex: {
    batchSize: Number(cfg.get('imageIndex.batchSize')),
  },
}
