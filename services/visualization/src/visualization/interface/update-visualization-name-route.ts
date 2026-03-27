import {VisualizationService, VisualizationServiceResponse} from '../service/visualization-service.js'
import {RouteFactory, routeVerb} from '@hopara/http-server'
import { SchemaRepository } from '../../schema/schema-repository.js'

interface InputSchema {
  id: string
  name: string
}

const inputSchema = {
  type: 'object',
  properties: {name: {type: 'string'}},
  required: ['name'],
}

export const updateVisualizationNameRoute: RouteFactory<InputSchema, VisualizationServiceResponse> = () => ({
  path: '/visualization/:id/name',
  scope: 'app:write',
  verb: routeVerb.put,
  authenticated: true,
  openAPI: {
    inputSchema,
    outputSchema: {},
  },
  beforeHandler: async ({req, container}) => {
    await container.resolve<SchemaRepository>('schemaRepository').validateSchema((req as any).rawBody, inputSchema)
  },
  handler: ({params, container, userInfo}) => {
    return container.resolve<VisualizationService>('visualizationService').changeName(
      params.id,
      params.name,
      userInfo,
    )
  },
})
