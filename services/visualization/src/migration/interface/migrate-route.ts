import {RouteFactory, routeVerb} from '@hopara/http-server'
import {TenantService} from '../tenant-service.js'
import {MigrationService} from '../migration-service.js'

interface InputSchema {
  schemaName: string
}

export const migrateRoute: RouteFactory<InputSchema, { message: string, migrations: any[] }> = () => ({
  path: '/migrate/:schemaName',
  verb: routeVerb.put,
  authenticated: true,
  scope: 'tenant:admin',
  handler: async ({params, container}) => {
    const result = await container
      .resolve<MigrationService>('migrationService')
      .migrate(TenantService.sanitize(params.schemaName))

    return {
      message: `${result.length} migration(s) successfully executed!`,
      migrations: result,
    }
  },
})

