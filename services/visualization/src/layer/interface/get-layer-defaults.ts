import {RouteFactory, routeVerb} from '@hopara/http-server'
import { LayerDefaultsService } from '../service/layer-defaults-service.js'
import { VisualizationType } from '../../visualization/domain/spec/Visualization.js'

interface InputSchema {
  visualizationType: VisualizationType | undefined,
}

export const getLayerDefaults: RouteFactory<InputSchema, any> = () => ({
  path: '/layer-defaults/:visualizationType?',
  verb: routeVerb.get,
  authenticated: false,
  handler: async ({params}) => {
    return LayerDefaultsService.getLayerDefaults(params.visualizationType)
  },
})
