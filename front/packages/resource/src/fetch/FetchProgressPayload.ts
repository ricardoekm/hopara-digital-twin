import {ResourceType} from './ResourceType'

export type FetchProgressPayload = {
  key: string
  entity: ResourceType
  progress?: number
}
