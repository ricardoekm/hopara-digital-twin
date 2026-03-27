import { EventEmitter } from '../events/EventEmitter'
import { EventReceiver } from '../events/EventReceiver'
import { CallbackFunctionData, InitData, LoadDataRequestData, PostMessageEvent, isCallbackFunctionEvent, isLoadDataEvent, isReadyEvent } from '../events/Events'
import packageJSON from '../../package.json'
import { DataLoader } from '@hopara/dataset'
import { Logger } from '@hopara/internals'

interface CallbackAction {
  name: string
  callback: (row: any, pixel?: any) => void
}

export interface HoparaIframeConfig extends InitData {
  targetElementId?: string
  targetElement?: HTMLElement | null
  version?: string
  debug?: boolean
  embeddedUrl?: string
  callbacks?: CallbackAction[]
}

const embeddedEnvUrl = {
  'test': 'https://statics.test.hopara.app/embedded',
  'production': 'https://statics.hopara.app/embedded',
}

export class Hopara {
  private static _version = packageJSON.version
  config: HoparaIframeConfig
  private iframe?: HTMLIFrameElement
  private readyEventTimeoutId?: number
  private readonly readyEventTimeoutMs = 5000

  constructor(config: HoparaIframeConfig) {
    this.config = config
  }

  private getIframeSrc() {
    const envUrl = embeddedEnvUrl[this.config.env ?? 'production'] ?? embeddedEnvUrl.production
    const url = this.config.embeddedUrl ? this.config.embeddedUrl : `${envUrl}/${this.config.version ? this.config.version : 'latest'}`
    return `${url}?v=${Date.now()}${this.config.debug ? '&debug=true' : ''}`
  }

  private getIframeStyle() {
    return 'background-color: transparent; border: 0px none transparent; padding: 0px; overflow: hidden; width: 100%; height: 100%;'
  }

  private createIframe(): HTMLIFrameElement {
    const iframe = document.createElement('iframe')

    iframe.setAttribute('src', this.getIframeSrc())
    iframe.setAttribute('allow', 'geolocation; fullscreen')
    iframe.setAttribute('style', this.getIframeStyle())
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-modals allow-downloads allow-top-navigation')
  
    return iframe
  }

  private getEventData(): InitData {
    const eventData = {
      ...this.config,
      visualizationId: this.config.visualizationId ?? (this.config as any).visualization ?? (this.config as any).app,
      dataLoaders: this.config.dataLoaders?.map((dataLoader) => {
        return {
          query: dataLoader.query ?? (dataLoader as any).name,
          source: dataLoader.source,
          cache: dataLoader.cache,
        } as DataLoader
      }),
      callbackNames: this.config.callbacks?.map((callback) => callback.name),

      // remove uneccessary properties from the event data to prevent postMessage errors and reduce the payload size
      callbacks: undefined,
      targetElementId: undefined,
      targetElement: undefined,
    }

    return eventData
  }

  private handleReadyEvent(targetWindow: Window | MessageEventSource) {
    return EventEmitter.init(this.getEventData(), targetWindow as Window)
  }

  private handleLoadDataEvent(event: PostMessageEvent<LoadDataRequestData>, targetWindow: Window | MessageEventSource) {
    const dataLoader = this.config.dataLoaders?.find((dataLoader) => {
      return (dataLoader.query === event.data.data.query || (dataLoader as any).name === event.data.data.query) &&
             dataLoader.source === event.data.data.source
    })

    return dataLoader?.loader(event.data.filterSet)
      .then((data) => EventEmitter.loadDataResponse(
        this.getEventData(),
        dataLoader,
        data,
        undefined,
        targetWindow as Window,
      ))
      .catch((error) => EventEmitter.loadDataResponse(
        this.getEventData(),
        dataLoader,
        [],
        error,
        targetWindow as Window,
      ))
  }

  handleCallbackFunctionEvent(event: PostMessageEvent<CallbackFunctionData>) {
    const callbackFunc = this.config.callbacks?.find((callback) => callback.name === event.data.name)
    if (!callbackFunc) return
    return callbackFunc.callback(event.data.row, event.data.pixel)
  }

  listenerFunction(event: PostMessageEvent<any>) {
    const targetWindow = this.iframe?.contentWindow ?? event.source
    if (!targetWindow && EventReceiver.isHoparaMessage(event)) {
      throw new Error('Hopara: targetWindow is not available')
    }

    if (isReadyEvent(event)) {
      this.clearReadyEventTimeout()
      return this.handleReadyEvent(targetWindow!)
    }

    if (isLoadDataEvent(event)) {
      return this.handleLoadDataEvent(event, targetWindow!)
    }

    if (isCallbackFunctionEvent(event)) {
      return this.handleCallbackFunctionEvent(event)
    }
  }

  private cachedListenerFunction

  private createListeners() {
    this.cachedListenerFunction = this.listenerFunction.bind(this)
    window.addEventListener('message', this.cachedListenerFunction, true)
  }

  private removeListeners() {
    window.removeEventListener('message', this.cachedListenerFunction, true)
  }

  private scheduleReadyEventTimeout(targetWindow?: Window | MessageEventSource | null) {
    if (typeof window === 'undefined') return

    const windowToWatch = targetWindow ?? this.iframe?.contentWindow ?? null
    if (!windowToWatch) return

    this.clearReadyEventTimeout()
    this.readyEventTimeoutId = window.setTimeout(() => {
      Logger.warn('Hopara: ready event not received within 5s, reloading target window')
      this.readyEventTimeoutId = undefined
      this.reloadTargetWindow(windowToWatch)
    }, this.readyEventTimeoutMs)
  }

  private clearReadyEventTimeout() {
    if (!this.readyEventTimeoutId) return

    clearTimeout(this.readyEventTimeoutId)
    this.readyEventTimeoutId = undefined
  }

  private reloadTargetWindow(targetWindow?: Window | MessageEventSource | null) {
    const windowToReload = targetWindow ?? this.iframe?.contentWindow ?? null
    if (!windowToReload && !this.iframe) return

    let reloaded = false

    if (windowToReload) {
      try {
        const location = (windowToReload as Window).location
        if (location && typeof location.reload === 'function') {
          location.reload()
          reloaded = true
        }
      } catch (error) {
        Logger.warn('Hopara: unable to reload target window directly', error as Error)
      }
    }

    if (!reloaded && this.iframe) {
      this.iframe.setAttribute('src', this.getIframeSrc())
      reloaded = true
    }

    if (reloaded) {
      this.scheduleReadyEventTimeout()
    }
  }

  private doInit = () => {
    const targetElement = this.config.targetElementId ? document.getElementById(this.config.targetElementId) : this.config.targetElement
    if (!targetElement) {
      Logger.warn('Hopara: targetElement not found')
      return this
    }
  
    const iframe = this.createIframe()
    targetElement.appendChild(iframe)
    this.iframe = iframe

    this.createListeners()
    this.scheduleReadyEventTimeout()
    return this
  }

  refresh(): void {
    if (!this.iframe) throw new Error('Hopara: iframe is not available')

    if (this.iframe.contentWindow) {
      EventEmitter.refresh(this.getEventData(), this.iframe.contentWindow)
    }
  }

  update(config: Partial<HoparaIframeConfig>): void {
    this.config = Object.assign({}, this.config, config)

    if (this.iframe?.contentWindow) {
      EventEmitter.update(this.getEventData(), this.iframe.contentWindow)
    }
  }

  destroy(): void {
    if (!this.iframe) throw new Error('Hopara: iframe is not available')

    this.iframe.remove()
    this.iframe = undefined
    this.clearReadyEventTimeout()
    this.removeListeners()
  }

  static init(config: HoparaIframeConfig) {
    if (!config) {
      Logger.warn('Hopara: init config not present'); return
    }
    if ((!window || !window.document)) {
      Logger.warn('Hopara: window is not available'); return
    }

    const client = new Hopara(config)
    return client.doInit()
  }

  static moduleVersion(): string {
    return this._version
  }

  moduleVersion(): string {
    return Hopara._version
  }
}

export default Hopara
