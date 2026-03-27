import tracer from 'dd-trace'
tracer.init()

import express from 'express'
import { AppConfig } from '../container'
import { Logger } from '../log'
import { withMiddlewares } from './middleware'
import { withRoutes } from './routes'
import { withWebsockets } from './websockets'

export function start(config:AppConfig, logger:Logger) {
   const app = express()
   withMiddlewares(app, logger)
   withRoutes(app)
  
   const server = app.listen(config.server.port, () => {
      logger.info('🚀 Server started with config 🚀 ', config)
   })
   server.keepAliveTimeout = 610000
   server.headersTimeout = 620000
   withWebsockets(server, logger)
}
