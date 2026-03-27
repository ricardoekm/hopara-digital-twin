import { TemplateService } from '../TemplateService'
import {RouteFactory, routeVerb} from '@hopara/http-server'

export const listTemplateRoute: RouteFactory<any, string[], TemplateService> = (templateService: any) => ({
  path: '/template',
  verb: routeVerb.get,
  handler: async () => {
    return await templateService.list()
  },
})

