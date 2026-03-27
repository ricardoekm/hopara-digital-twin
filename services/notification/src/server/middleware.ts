import { Express, json, } from 'express'
import cors from 'cors'
import { Logger, middleware as log } from '../log'

 
export const corsOptionsDelegate = (req: any, callback: any): void => {
    callback(null, { origin: '*', credentials: true, allowedHeaders: [
        'authorization',
        'tenant',
        'content-type',
        'session-id',
        'next-page-token',
        'x-datadog-origin',
        'x-datadog-parent-id',
        'x-datadog-sampling-priority',
        'x-datadog-trace-id',
    ] })
}

export function withMiddlewares(app:Express, logger:Logger): void {
    app.use(json())
    app.use(cors(corsOptionsDelegate))
    app.use(log(logger))
}
