import {Logger} from '@hopara/logger'
import {Route} from '@hopara/http-server/lib/route'
import {HttpServer} from '@hopara/http-server'
import {config} from './config'
import { AwilixContainer } from 'awilix'
import { instrumentRouteWithHttpMetrics } from './metrics/http-metrics'


export const serverFactory = (logger: Logger, routes: Route<any, any>[], container: AwilixContainer): HttpServer => new HttpServer({
  name: config.service.name,
  authConfig: config.auth.enabled !== false ? config.auth : undefined,
  serverConfig: config.server,
  version: config.version,
  logger,
  routes: routes.map(instrumentRouteWithHttpMetrics),
  container,
  compress: true,
})
