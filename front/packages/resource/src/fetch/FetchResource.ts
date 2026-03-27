import { Authorization } from '@hopara/authorization'
import {ResourceType} from './ResourceType'

export type FetchProgressCallback = (key:string, fetchEntity: ResourceType, progress?: number) => void

export interface FetchResource {
  fetch: (
    downloadProgressCallback: FetchProgressCallback,
    getAbortController?: () => AbortController,
    authorization?: Authorization,
  ) => (url: string, options: any) => Promise<any>
}
