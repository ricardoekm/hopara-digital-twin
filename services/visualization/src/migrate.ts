import {MigrationService} from './migration/migration-service.js'
import {containerFactory} from './container.js';

(async () => {
  const container = await containerFactory()

  const migrator = await container.resolve<MigrationService>('migrationService')
  await migrator.migrate('hopara_io')
})()
