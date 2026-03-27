import { Config } from '@hopara/config'
import { ResourceType } from './Resource'

const pathPosition = {
  [ResourceType.ICON]: 3,
  [ResourceType.IMAGE]: 5,
  [ResourceType.MODEL]: 5,
}

const shouldIgnorePath = (splittedPath: string[], paramPosition: number, allowSubPaths: boolean) => {
  // we add 2 to the paramPosition because the path starts with a slash and ends with the resource value
  return !allowSubPaths && splittedPath.length > paramPosition + 2
}

const isPathOfType = (path: string, type: string, paramPosition: number, allowSubPaths = false) => {
  const splittedPath = path.split('/')
  if (shouldIgnorePath(splittedPath, paramPosition, allowSubPaths)) return false
  return splittedPath[paramPosition] && splittedPath[paramPosition] === type
}

export const urlMachesResourceType = (resourceType: ResourceType, allowSubPaths?: boolean) => ({ url }) => {
  return url.origin === Config.getValue('RESOURCE_API_ADDRESS') && isPathOfType(url.pathname, resourceType, pathPosition[resourceType], allowSubPaths)
}
