import { Template } from '../Template'
import { TemplateService } from '../TemplateService'
import {RouteFactory, routeVerb, NotFoundError} from '@hopara/http-server'

interface RouteInput {
  id: string
}

export const getTemplateRoute: RouteFactory<RouteInput, Template, TemplateService> = (templateService) => ({
  path: '/template/:id',
  verb: routeVerb.get,
  handler: async ({params}) => {
    const template = await templateService.get(params.id)
    if (!template) throw new NotFoundError('Template not found')
    return template
  },
})

