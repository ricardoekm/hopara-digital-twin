import {Logger} from '@hopara/logger'
import {Route} from '@hopara/http-server'
import {HttpServer} from '@hopara/http-server'
import {config} from './config/index.js'
import { instrumentRouteWithHttpMetrics } from './metrics/http-metrics.js'


export const serverFactory = (logger: Logger, routes: Route<any, any>[], container: any): HttpServer => new HttpServer({
  name: 'visualization',
  baseUrl: 'https://app.hopara.app',
  authConfig: config.auth.enabled !== false ? config.auth : undefined,
  serverConfig: config.server,
  version: config.version,
  logger,
  routes: routes.map(instrumentRouteWithHttpMetrics),
  container,
})
