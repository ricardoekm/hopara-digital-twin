import {LoggerConfig} from '@hopara/logger'
process.env['NODE_CONFIG_DIR'] = __dirname
import cfg from 'config'
import {version} from '../../package.json'
const moduleVersion = `${version}${process.env.BUILD_NUMBER ? '+' + process.env.BUILD_NUMBER : ''}`

// So typescript copies it on build
import hack1 from './default.json'
import hack2 from './custom-environment-variables.json'
import { VisualizationConfig } from '../visualization/VisualizationRepository'
import { DatasetConfig } from '../query/DatasetRepository'
import {ResourceConfig} from '../resource/ResourceRepository'
import { TemplateConfig } from '../template/TemplateRepository'

export {hack1, hack2}

export type Config = {
  service: {
    name: string
  }
  server: {
    port: number
  }
  http: {
    keepAlive: boolean
    timeout: number
  },
  auth: {
    enabled: boolean
    jwtIssuer: string,
    jwksUri: string
  },
  google: {
    key: string
  }
  logger: LoggerConfig
  visualization: VisualizationConfig
  resource: ResourceConfig
  dataset: DatasetConfig
  template: TemplateConfig
  version: string
}

export const config: Config = {
  service: cfg.get('service'),
  server: {
    ...cfg.get('server'),
    port: Number(cfg.get('server.port')),
  },
  logger: cfg.get('logger'),
  visualization: cfg.get('visualization'),
  resource: cfg.get('resource'),
  dataset: cfg.get('dataset'),
  template: cfg.get('template'),
  http: cfg.get('http'),
  auth: cfg.get('auth'),
  google: cfg.get('google'),
  version: moduleVersion,
}
