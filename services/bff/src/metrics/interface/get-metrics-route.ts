import { Response, RouteFactory, routeVerb } from '@hopara/http-server'

import { register } from '../metrics'

export const getMetricsRoute: RouteFactory<Record<string, never>, Response> = () => ({
  path: '/metrics',
  verb: routeVerb.get,
  handler: async () => {
    const metrics = await register.metrics()

    return new Response(metrics, 'text/plain; version=0.0.4; charset=utf-8', {
      'Cache-Control': 'no-cache',
    })
  },
})
