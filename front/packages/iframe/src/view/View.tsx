import React from 'react'
import {MemoryRouter} from 'react-router-dom'
import {EmbeddedProvider, EmbeddedProps} from './Provider'
import { HoparaController } from '@hopara/components/src/hoc/HoparaController'
import { EventType, HOPARA_EVENT_TYPE, InitData, PostMessageEvent } from '../events/Events'
import { EventReceiver } from '../events/EventReceiver'
import { EventEmitter } from '../events/EventEmitter'
import {Router} from './Router'
import { PureComponent } from '@hopara/design-system'
import { Box } from '@mui/material'
import HoparaProvider from '@hopara/components/src/hoc/Provider'
import { DataLoader } from '@hopara/dataset'
import { PlainDataLoader } from '@hopara/dataset/src/loader/DataLoader'

type Props = {
  children?: React.ReactElement
}

export class View extends PureComponent<Props, EmbeddedProps> {
  constructor(props) {
    super(props)
    this.state = {
      accessToken: '',
      visualizationId: '',
      fallbackVisualizationId: undefined,
      visualizationScope: undefined,
      env: undefined,
      refreshToken: undefined,
      tenant: undefined,
      dataLoaders: undefined,
      initialRow: undefined,
      controller: undefined,
      darkMode: undefined,
      callbacks: undefined,
      attribution: undefined,
      filters: undefined,
      language: undefined,
      initialTab: undefined,
      navigationControls: undefined,
    }
  }

  private dataLoaderAsPostMessage(dataLoader: PlainDataLoader): DataLoader {
    const migratedDataLoader = {
      query: dataLoader.query ?? (dataLoader as any).name,
      source: dataLoader.source,
      cache: dataLoader.cache,
    }

    return new DataLoader({
      ...migratedDataLoader,
      loader: async (filterSet) => {
        EventEmitter.loadDataRequest(migratedDataLoader, filterSet)
        return EventReceiver.loadDataResponse(migratedDataLoader)
      },
    })
  }

  private callbacksAsPostMessage(name: string): any {
    return {
      name,
      callback: (data) => EventEmitter.callback(name, data),
    }
  }
  private getVisualizationId(event:PostMessageEvent<InitData>): string {
    return event.data.visualizationId ?? event.data.fallbackVisualizationId!
  }

  handleInitEvent(event:PostMessageEvent<InitData>, callback?: () => void) {
    const newState = Object.keys(this.state).reduce((state, key) => {
      // we only update the state if the key is present in the new event data
      return { ...state, [key]: key in event.data ? event.data[key] : state[key] }
    }, this.state)

    this.setState({
      ...newState,
      accessToken: event.data.accessToken!,
      visualizationId: this.getVisualizationId(event),
      callbacks: event.data.callbackNames?.map(this.callbacksAsPostMessage.bind(this)),
      dataLoaders: event.data.dataLoaders?.map(this.dataLoaderAsPostMessage.bind(this)),
      controller: new HoparaController(),
    }, callback)
  }

  private shouldSkipEvent(event:PostMessageEvent<any>): boolean {
    const isValidEvent = event.data.__hopara__eventType__ === EventType.INIT ||
                         event.data.__hopara__eventType__ === EventType.UPDATE ||
                         event.data.__hopara__eventType__ == EventType.REFRESH
    const hasVisualizationId = !!event.data.visualizationId ||
                               !!event.data.visualization ||
                               !!event.data.app ||
                               !!event.data.fallbackVisualizationId

    return !isValidEvent || !event.data.accessToken || !hasVisualizationId
  }

  initMessageListener(event:PostMessageEvent<InitData>) {
    if (this.shouldSkipEvent(event)) return

    switch (event.data[HOPARA_EVENT_TYPE]) {
      case (EventType.INIT):
      case (EventType.UPDATE):
        return this.handleInitEvent(event)
      case (EventType.REFRESH):
        return this.state.controller?.refresh()
    }
  }

  cachedInitMessageListener: EventListenerOrEventListenerObject

  registerToReceiveMessage() {
    if (!window) return

    this.cachedInitMessageListener = this.initMessageListener.bind(this) as any
    window.addEventListener('message', this.cachedInitMessageListener, false)

    EventEmitter.ready()
  }

  cachedRegisterToReceiveMessage: any

  componentDidMount(): void {
    this.cachedRegisterToReceiveMessage = this.registerToReceiveMessage.bind(this)
    window.addEventListener('load', this.cachedRegisterToReceiveMessage, false)
  }

  unregisterToReceiveMessage() {
    if (!window) return

    if (this.cachedRegisterToReceiveMessage) {
      window.removeEventListener('load', this.cachedRegisterToReceiveMessage, false)
    }

    if (this.cachedInitMessageListener) {
      window.removeEventListener('message', this.cachedInitMessageListener, false)
    }    
  }

  componentWillUnmount(): void {
    this.unregisterToReceiveMessage()
  }

  render() {
    return (
      <Box sx={{
        'width': '100vw',
        'height': '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
      }}>
        <HoparaProvider>
          <MemoryRouter>
            <EmbeddedProvider {...this.state as any} />
            <Router />
          </MemoryRouter>
        </HoparaProvider>
      </Box>
    )
  }
}
