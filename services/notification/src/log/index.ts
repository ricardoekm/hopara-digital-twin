import { Logger as WinstonLogger } from 'winston'
export type Logger = WinstonLogger

export type LoggerConfig = {
    level: string,
    format: string,
}

export const middleware = (logger:Logger):any => (req: any, res: any, next: any) => {
    logger.debug(`HTTP Request`, {method: req.method, url: req.url})
    return next()
}
