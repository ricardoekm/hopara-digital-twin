import { Route } from '@hopara/http-server'

import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
} from './metrics'

const METRICS_INSTRUMENTED = Symbol('httpMetricsInstrumented')

const getStatusCodeFromError = (error: unknown): string => {
  if (!error || typeof error !== 'object') return '500'

  const maybeNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    return undefined
  }

  const err = error as Record<string, unknown>

  const code = maybeNumber(err.code)
  if (code && code >= 100 && code <= 599) return String(code)

  const status = maybeNumber(err.status)
  if (status && status >= 100 && status <= 599) return String(status)

  const responseStatus = maybeNumber((err.response as Record<string, unknown> | undefined)?.status)
  if (responseStatus && responseStatus >= 100 && responseStatus <= 599) return String(responseStatus)

  return '500'
}

const instrumentHandler = <I, O>(route: Route<I, O>, handler: Route<I, O>['handler']) => {
  const method = route.verb.toUpperCase()
  const routeLabel = route.path

  const wrappedHandler: typeof handler = async (input) => {
    const endTimer = httpRequestDurationSeconds.startTimer({ method, route: routeLabel })

    try {
      const output = await handler(input)
      const statusCode = '200'

      httpRequestsTotal.inc({ method, route: routeLabel, status_code: statusCode })
      endTimer({ status_code: statusCode })

      return output
    } catch (error) {
      const statusCode = getStatusCodeFromError(error)

      httpRequestsTotal.inc({ method, route: routeLabel, status_code: statusCode })
      endTimer({ status_code: statusCode })

      throw error
    }
  }

  ;(wrappedHandler as any)[METRICS_INSTRUMENTED] = true

  return wrappedHandler
}

export const instrumentRouteWithHttpMetrics = <I, O>(route: Route<I, O>): Route<I, O> => {
  if (route.path === '/metrics') {
    return route
  }

  if ((route.handler as any)[METRICS_INSTRUMENTED]) {
    return route
  }

  const handler = instrumentHandler(route, route.handler)

  return {
    ...route,
    handler,
  }
}
