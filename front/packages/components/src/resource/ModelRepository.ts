import {ResourceRepository} from './ResourceRepository'
import {Authorization} from '@hopara/authorization'
import {OnUploadFunction} from '@hopara/http-client'
import {ResourceHistoryItem, ResourceType} from '@hopara/resource'

export class ModelRepository {
  static async save(
    resourceId: string,
    library: string | undefined,
    resourceFile: File,
    authorization: Authorization,
    onUploadProgress: OnUploadFunction | undefined,
  ) {
    return ResourceRepository.save(resourceId, library, resourceFile, authorization, onUploadProgress, ResourceType.model)
  }

  static async loadHistory(resourceId: string, library: string, authorization: Authorization): Promise<ResourceHistoryItem[]> {
    return ResourceRepository.loadHistory(resourceId, library, authorization, ResourceType.model)
  }

  static async checkoutMetadata(resourceId: string, library: string, version: number | undefined, authorization: Authorization): Promise<any> {
    return ResourceRepository.checkoutMetadata(resourceId, library, version, authorization, ResourceType.model)
  }

  static async restoreVersion(resourceId: string, library: string, version: number, authorization: Authorization): Promise<any> {
    return ResourceRepository.restoreVersion(resourceId, library, version, authorization, ResourceType.model)
  }

  static async rollback(resourceId: string, library: string, version: number, authorization: Authorization): Promise<any> {
    return ResourceRepository.rollback(resourceId, library, version, authorization, ResourceType.model)
  }
}
