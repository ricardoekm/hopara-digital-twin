import { K8SRepository } from '../k8s/K8SRepository'
import { SubscriptionRepository } from '../subscription/subscription-repository'
import socketIO from 'socket.io'
import { NotifyRepository } from './NotifyRepository'
import { Logger } from '../log'
import memoize from 'memoizee'
import config from '../config'

export class NotifyService {
    subscriptionRepository:SubscriptionRepository
    k8sRepository:K8SRepository
    notifyRepository:NotifyRepository
    logger:Logger
    memoizedGetPodIps: any

    constructor(subscriptionRepository:SubscriptionRepository, k8sRepository:K8SRepository, 
                notifyRepository:NotifyRepository, logger: Logger) {
{
        this.subscriptionRepository = subscriptionRepository
        this.k8sRepository = k8sRepository
        this.notifyRepository = notifyRepository
        this.logger = logger
        this.memoizedGetPodIps = memoize(() => this.k8sRepository.getPodIps(process.env.MY_POD_IP as string), {maxAge: 1000 * 60 * 30})
    }
}

    doNotify(event:string, payload:any, socket:socketIO.Socket) {
        socket.emit(event, payload)
    }

    async broadcast(type:string, tenant: string, sessionId: string, value:string | undefined, payload:any) {
      if (!config.get<boolean>('broadcast.enabled')) {
        return
      }
      
      try {
         const ips = await this.memoizedGetPodIps()
         for ( const ip of ips ) {
            try {
               await this.notifyRepository.notify(ip, type, tenant, sessionId, value, payload)
            } catch (e) {
               this.logger.error(`Broadcast to ${ip} failed`, e)
            }
         }
      } catch (e) {
        this.logger.error('Broadcast failed', e)
      }
    }

    notify(event:string, tenant: string, sessionId: string, value:string | undefined, payload:any, broadcast: boolean) : void {
        if ( broadcast ) {
            this.broadcast(event, tenant, sessionId, value, payload)
        }

        const subscriptions = this.subscriptionRepository.findForNotification(event, tenant, sessionId, value)
        for ( const subscription of subscriptions ) {
            this.doNotify(event, payload, subscription.socket)
        }
    }
}
