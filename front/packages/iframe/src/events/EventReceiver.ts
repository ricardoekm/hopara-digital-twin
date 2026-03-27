import { DataLoader, LoaderResponse } from '@hopara/dataset'
import { EventType, HOPARA_EVENT_TYPE, LoadDataResponseData, PostMessageEvent } from './Events'

export class EventReceiver {
  static isHoparaMessage(event: any): boolean {
    return event.data[HOPARA_EVENT_TYPE] !== undefined
  }

  static loadDataResponse(dataLoader: Partial<DataLoader>): Promise<LoaderResponse> {
    return new Promise((resolve) => {
      const callback = (event: PostMessageEvent<LoadDataResponseData>) => {
        if (
          event.data[HOPARA_EVENT_TYPE] === EventType.LOAD_DATA_RESPONSE &&
          (event.data.data.query === dataLoader.query || (event.data.data as any).name === dataLoader.query) &&
          event.data.data.source === dataLoader.source) {
          window.removeEventListener('message', callback, false)
          resolve({rows: event.data.rows ?? [], columns: event.data.columns ?? [], error: event.data.error})
        }
      }

      window.addEventListener('message', callback, false)
    })
  }
}
