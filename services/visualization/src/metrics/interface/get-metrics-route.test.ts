import {Response} from '@hopara/http-server'

import {register} from '../metrics.js'
import {getMetricsRoute} from './get-metrics-route.js'

describe('get-metrics-route', () => {
  it('returns a Response with Prometheus metrics payload', async () => {
    const route = getMetricsRoute()

    const result = await route.handler({
      params: undefined as never,
      rawBody: Buffer.alloc(0),
      headers: {},
      container: {} as never,
      userInfo: {} as never,
    })

    expect(result).toBeInstanceOf(Response)
    expect(result.type).toBe(register.contentType)
    expect(result.headers).toMatchObject({
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    })
    expect(result.body).toContain('process_cpu_seconds_total')
  })
})
