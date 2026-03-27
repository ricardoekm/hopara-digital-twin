import webSocketServer from 'socket.io-client'
import actions from '../state/Actions'
import {Config} from '@hopara/config'
import { Data } from '@hopara/encoding'
import { getSessionId } from '../analytics/SessionId'

export enum NotificationType {
  QUERY_CHANGE = 'QUERY_CHANGE',
  GENERATE_PROGRESS = 'GENERATE_PROGRESS',
  POSITION_CHANGE = 'POSITION_CHANGE',
  VISUALIZATION_CHANGE = 'VISUALIZATION_CHANGE',
  ROW_CHANGE = 'ROW_CHANGE',
  MODEL_PROCESSED = 'MODEL_PROCESSED'
}

export class NotificationListener {
  static instance: NotificationListener
  static dispatcher: any
  socket: any

  onVisualizationChanged() {
    NotificationListener.dispatcher(actions.visualization.changed())
  }

  onQueryChanged() {
    NotificationListener.dispatcher(actions.query.changed())
  }

  onRowChanged(message:any) {
    const data = new Data({source: message.view.dataSource, query: message.view.name})
    NotificationListener.dispatcher(actions.rowset.rowUpdated({data, rowId: message.rowId, row: message.row}))
  }
  
  onPositionChanged(message:any) {
    try {
      const data = new Data({source: message.view.dataSource, query: message.view.name})
      NotificationListener.dispatcher(actions.rowset.rowPositionUpdated({data, rowId: message.rowId, row: message.row}))
      // eslint-disable-next-line no-empty
    } catch {}
  }

  onResourceProgress(message:any) {
    NotificationListener.dispatcher(actions.resource.generateProgress({
      library: message.library,
      resourceId: message.id,
      progress: message.progress
    }))
  }

  onModelProcessed(message:any) {
    NotificationListener.dispatcher(actions.resource.modelProcessed({
      library: message.library,
      resourceId: message.id,
    }))
  }

  createSocketServer() {
    return webSocketServer(Config.getValue('NOTIFICATION_API_ADDRESS'), {
      'reconnection': true,
      'reconnectionDelay': 5000,
      'reconnectionDelayMax': 10000,
      'reconnectionAttempts': 5,
      'withCredentials': true
    })
  }

  private constructor() {
    NotificationListener.dispatcher({type: 'WATCHER_INIT'})
    this.socket = this.createSocketServer()
    this.socket.on(NotificationType.QUERY_CHANGE, this.onQueryChanged.bind(this))
    this.socket.on(NotificationType.VISUALIZATION_CHANGE, this.onVisualizationChanged.bind(this))
    this.socket.on(NotificationType.POSITION_CHANGE, this.onPositionChanged.bind(this))
    this.socket.on(NotificationType.ROW_CHANGE, this.onRowChanged.bind(this))
    this.socket.on(NotificationType.GENERATE_PROGRESS, this.onResourceProgress.bind(this))
    this.socket.on(NotificationType.MODEL_PROCESSED, this.onModelProcessed.bind(this))
  }

  subscribe(event:string, tenant: string, value?: string) {
    this.socket.emit('SUBSCRIBE', {event, tenant, value, sessionId: getSessionId()})
  }

  unsubscribe(event?:string) {
    this.socket.emit('UNSUBSCRIBE', {event})
  }

  static configure(dispatcher) {
    NotificationListener.dispatcher = dispatcher
  }

  static init() {
    NotificationListener.instance = new NotificationListener()
  }

  static getInstance(): NotificationListener {
    if (!NotificationListener.instance) NotificationListener.init()
    return NotificationListener.instance
  }
}
