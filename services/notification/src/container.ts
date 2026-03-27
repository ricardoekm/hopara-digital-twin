import config from 'config'
import winston from 'winston'
import { Logger, LoggerConfig } from './log'
import { NotifyService } from './notify/NotifyService'
import { SubscriptionRepository } from './subscription/subscription-repository'
import { K8SRepository } from './k8s/K8SRepository'
import {KubeConfig, CoreV1Api} from '@kubernetes/client-node'
import { NotifyRepository } from './notify/NotifyRepository'
import axios from 'axios'

export type AppConfig = {
   server: {
       port: number,
   },
   logger: LoggerConfig,
}

class Container {
   subscriptionRepository: SubscriptionRepository
   k8sRepository: K8SRepository
   appConfig: AppConfig
   notifyService: NotifyService
   notifyRepository: NotifyRepository
   logger:Logger

   private setupSubscriptionRepository() {
      this.subscriptionRepository = new SubscriptionRepository()
   }

   private setupNotifyRepository() {
      this.notifyRepository = new NotifyRepository(axios.create())
   }

   private setupNotifyService() {
      this.notifyService = new NotifyService(this.subscriptionRepository, this.k8sRepository, this.notifyRepository, this.logger)
   }

   private setupK8SRepository() {
      const kc = new KubeConfig()
      kc.loadFromDefault()
      const k8sApi = kc.makeApiClient(CoreV1Api)
      this.k8sRepository = new K8SRepository(k8sApi)
   }

   private setupAppConfig() {
      this.appConfig = {
         server: {
           ...config.get('server'),
           port: Number(config.get('server.port'))
         },
         logger: config.get('logger'),
       }
   }

   private setupLogger() {
      this.logger = winston.createLogger({
         level: this.appConfig.logger.level,
         format: this.appConfig.logger.format == 'json' ? winston.format.json() : winston.format.simple(),
         defaultMeta: { service: 'watcher' },
         transports: [
             new winston.transports.Console(),
         ]
      })
   }

   constructor() {
      this.setupNotifyRepository()
      this.setupK8SRepository()
      this.setupSubscriptionRepository()
      this.setupAppConfig()
      this.setupLogger()
      this.setupNotifyService()
   }
}

export default new Container()
