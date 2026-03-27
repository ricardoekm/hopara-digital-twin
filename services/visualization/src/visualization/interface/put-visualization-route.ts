import {VisualizationService, VisualizationServiceResponse} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import { SchemaRepository } from '../../schema/schema-repository.js'
import {VisualizationSpec} from '../domain/spec/Visualization.js'

type InputSchema = VisualizationSpec & {
  $schema?: string
  skipValidation?: boolean
}

export const putVisualizationRoute: RouteFactory<InputSchema, VisualizationServiceResponse> = () => ({
  path: '/visualization/:id',
  scope: 'app:write',
  verb: routeVerb.put,
  authenticated: true,
  beforeHandler: async ({params, req, container}) => {
    if (params.skipValidation) return
    await container.resolve<SchemaRepository>('schemaRepository').validate((req as any).rawBody, params.$schema ?? '')
  },
  handler: ({params, container, userInfo}) => {
    const {skipValidation, ...visualization} = params
    return container.resolve<VisualizationService>('visualizationService').upsert(
      visualization,
      !skipValidation,
      userInfo,
    )
  },
})
