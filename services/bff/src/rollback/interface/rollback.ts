import {RouteFactory, routeVerb} from '@hopara/http-server'
import { RollbackService } from '../RollbackService'

interface RouteInput {
  visualizationId: string
  date: any
  filters: any
}

export const rollback: RouteFactory<RouteInput, any, any> = () => ({
  path: '/rollback/:visualizationId',
  verb: routeVerb.put,
  handler: async ({params, container, headers}) => {
    const rollbackService = await container.resolve<RollbackService>('rollbackService')
    await rollbackService.rollback(params.visualizationId, params.date, params.filters, {
        tenant: headers.tenant,
        token: headers.authorization,
    })
    
    return { message: 'Rollback OK!' }
  },
})

