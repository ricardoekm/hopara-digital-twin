import 'reflect-metadata'
import {HttpServer} from '@hopara/http-server'
import './metrics/metrics.js'

import {containerFactory} from './container.js'
import {MigrationService} from './migration/migration-service.js'

(async () => {
  // eslint-disable-next-line no-console
  console.log(`   
   ▀ ▀██▄                  
 ▀ ▀ ▀████ ▄▄ █   █ ▀ ▀▀▀█ 
 ▀ ▀ ▀███▀    ▀▄ ▄▀ █  ▄▀  
   ▀ ▀▀▀        ▀   ▀ ▀▀▀▀ 
`)
  const container = await containerFactory()

  if (
    process.env.NODE_ENV !== 'production'
  ) {
    const migrator = await container.resolve<MigrationService>('migrationService')
    await migrator.migrate('hopara_io')
  }

  await container.resolve<HttpServer>('server').start()
})()
