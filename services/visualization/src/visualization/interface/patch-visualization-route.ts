import {RouteFactory, routeVerb} from '@hopara/http-server'
import {SchemaRepository} from '../../schema/schema-repository.js'
import {AwilixContainer} from 'awilix'
import {VisualizationService} from '../service/visualization-service.js'
import {VisualizationSpec} from '../domain/spec/Visualization.js'

type InputSchema = {
  skipValidation?: boolean
} & VisualizationSpec

const route = {
  scope: 'app:write',
  authenticated: true,
  beforeHandler: async ({params, req, container}: { params: InputSchema, req: any, container: AwilixContainer<any> }) => {
    const inferredParams = {...params}
    if (params.skipValidation) return
    await container.resolve<SchemaRepository>('schemaRepository').validate(req.rawBody)
    return inferredParams
  },
  handler: async ({params, container, userInfo}: {
    params: InputSchema,
    container: AwilixContainer<any>,
    userInfo: any
  }) => {
    const {...visualization} = params
    return container.resolve<VisualizationService>('visualizationService')
      .update(params.id!, visualization as any, userInfo)
  },
}

export const patchVisualizationRoute: RouteFactory<InputSchema, void> = () => ({
  ...route,
  path: '/visualization/:id',
  verb: routeVerb.patch,
} as any)
