import {RouteFactory, routeVerb} from '@hopara/http-server'
import {getSchema} from '../../schema/schema-repository.js'

export const getVisualizationSchemaRoute: RouteFactory<void, Record<string, any>> = () => ({
  path: '/schema',
  verb: routeVerb.get,
  handler: async () => {
    return getSchema('VisualizationSpec')
  },
})

