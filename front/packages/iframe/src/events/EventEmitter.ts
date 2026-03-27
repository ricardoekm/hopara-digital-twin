import { EventType, HOPARA_EVENT_TYPE, LoadDataRequestData } from './Events'
import { DataLoader, FilterSet, LoaderResponse } from '@hopara/dataset'

export class EventEmitter {
  private static sendMessage(data: any, targetWindow?: Window) {
    const target = targetWindow || window.parent || window.top
    if (!window) return
    // eslint-disable-next-line @microsoft/sdl/no-postmessage-star-origin
    target.postMessage(data, '*')
  }

  static ready(): void {
    this.sendMessage({[HOPARA_EVENT_TYPE]: EventType.READY})
  }

  static init(config: any, targetWindow: Window): void {
    this.sendMessage(Object.assign(config, {[HOPARA_EVENT_TYPE]: EventType.INIT}), targetWindow)
  }

  static loadDataRequest(dataLoader: Partial<DataLoader>, filterSet: FilterSet): void {
    this.sendMessage({
      [HOPARA_EVENT_TYPE]: EventType.LOAD_DATA,
      data: {query: dataLoader.query, name: dataLoader.query, source: dataLoader.source},
      filterSet,
    } as LoadDataRequestData)
  }

  static getRows(response: any, error?: Error) {
    if (error || !response) {
      return []
    }

    return Array.isArray(response) ? response : response.rows
  }

  static getColumns(response:any, error?: Error) {
    if (error) {
      return []
    }

    return Array.isArray(response) ? [] : response.columns
  }

  static getError(response:any, error?: Error) {
    if (error) {
      return error
    }

    if (!response) {
      return new Error('Load data with undefined response')
    }

    return undefined
  }


  static loadDataResponse(config: any, dataLoader: Partial<DataLoader>, response: any[] | LoaderResponse, error: Error | undefined, targetWindow: Window): void {   
    const rows = this.getRows(response, error)
    const columns = this.getColumns(response, error)
    this.sendMessage(Object.assign(
      config,
      {[HOPARA_EVENT_TYPE]: EventType.LOAD_DATA_RESPONSE},
      {data: {query: dataLoader.query ?? (dataLoader as any).name, source: dataLoader.source}, 
              rows, columns, error: this.getError(response, error)},
    ), targetWindow)
  }

  static refresh(config: any, targetWindow: Window): void {
    this.sendMessage({
      ...config,
      [HOPARA_EVENT_TYPE]: EventType.REFRESH,
    }, targetWindow)
  }

  static update(config:any, targetWindow: Window): void {
    this.sendMessage({
      ...config,
      [HOPARA_EVENT_TYPE]: EventType.UPDATE,
    }, targetWindow)
  }

  static callback(name: string, data: {[key: string]: any}): void {
    this.sendMessage({
      [HOPARA_EVENT_TYPE]: EventType.FUNCTION_CALLBACK,
      name,
      ...data,
    })
  }
}
