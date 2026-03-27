import {RouteFactory, routeVerb, Response} from '@hopara/http-server'

import {register} from '../metrics.js'

const CACHE_CONTROL_HEADER = 'no-cache, no-store, max-age=0, must-revalidate'

export const getMetricsRoute: RouteFactory<void, Response> = () => ({
  path: '/metrics',
  verb: routeVerb.get,
  public: true,
  handler: async () => new Response(
    await register.metrics(),
    register.contentType,
    {'Cache-Control': CACHE_CONTROL_HEADER},
  ),
})
