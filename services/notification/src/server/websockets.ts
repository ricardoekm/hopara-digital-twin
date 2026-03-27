import socketIO from 'socket.io'
import container from '../container'
import {Logger} from '../log'
import {Subscription} from '../subscription/subscription'

export function withWebsockets(server: any, logger: Logger) {
  const webSocketServer = new socketIO.Server(server, {
    allowRequest: (_: any, callback: any) => {
      callback(null, true)
    }
  })
  
  webSocketServer.on('connection', (socket: any) => {
    logger.debug('connected ', {socketId: socket.client.id})
    socket.on('SUBSCRIBE', (message: any) => {
      logger.debug('subscribed ', message)
      container.subscriptionRepository.save(new Subscription({
        id: socket.client.id,
        socket,
        tenant: message.tenant,
        event: message.event,
        value: message.value,
        sessionId: message.sessionId
      }))
    })

    socket.on('UNSUBSCRIBE', (message: any) => {
      logger.debug('unsubscribed ', message)
      container.subscriptionRepository.delete(socket.client.id, message.event)
    })

    socket.on('disconnect', () => {
      logger.debug('disconnected ', {socketId: socket.client.id})
      container.subscriptionRepository.delete(socket.client.id)
    })
  })

  webSocketServer.listen(server)
}
