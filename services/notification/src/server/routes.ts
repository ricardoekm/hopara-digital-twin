import { Express, Request, Response } from 'express'
import container from '../container'

function healthHandler(_request:Request, response:Response): any {
   return response.json({ message: 'Hi! I\'m the Notification.' })
}

function notifyHandler(request:Request, response:Response) : any {
   const broadcast = request.query.broadcast === 'false' ? false : true
   container.notifyService.notify(request.params.event as string,
                                  request.headers.tenant as string, 
                                  request.headers['session-id'] as string, 
                                  request.body.value, 
                                  request.body,
                                  broadcast)            
   return response.json({ message: 'Notified' })
}

export function withRoutes(app:Express) {
    app.get('/health', healthHandler)
    app.put('/notify/:event', notifyHandler)
}
