import {RouteFactory, routeVerb} from '@hopara/http-server'
import {TemplateService} from '../../template/TemplateService'


export const saveSampleVisualizationsRoute: RouteFactory<any, any, any> = () => ({
  path: '/sample-visualization',
  verb: routeVerb.post,
  handler: async ({container, headers}) => {
    await container.resolve<TemplateService>('templateService').applySamples(
      {
        tenant: headers.tenant,
        token: headers.authorization,
      }
    )
    return { message: 'Sample visualizations created successfully' }
  },
})

