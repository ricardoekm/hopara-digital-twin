import {Logger} from '@hopara/logger'
import {Route} from '@hopara/http-server'
import {HttpServer} from '@hopara/http-server'
import {config} from './config'
import { instrumentRouteWithHttpMetrics } from './metrics/http-metrics'

const authEnabled = config.auth.enabled !== false

export const serverFactory = (logger: Logger, routes: Route<any, any>[], container: any): HttpServer => new HttpServer({
  name: 'template-service',
  serverConfig: config.server,
  version: config.version,
  authConfig: authEnabled ? config.auth : undefined,
  logger,
  routes: routes.map(instrumentRouteWithHttpMetrics),
  container,
})
