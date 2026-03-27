import { Config } from '@hopara/config'
import { ResourceType } from './ResourceType'

export const DEFAULT_LIBRARY = 'default'

export function getBaseResourceUrl(id: string, library: string | undefined, tenant: string, resourceType: ResourceType): URL {
  return new URL(`${Config.getValue('RESOURCE_API_ADDRESS')}/tenant/${tenant}/${resourceType}-library/${library || DEFAULT_LIBRARY}/${resourceType}/${encodeURIComponent(id)}`)
}
