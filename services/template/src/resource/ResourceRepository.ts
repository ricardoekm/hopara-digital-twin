import {Logger} from '@hopara/logger'
import { StorageRepository } from '../storage/StorageRepository'

export interface TextResourceContent {
  Data: string,
  ContentType: string
}

export interface BinaryResourceContent {
  Data: Buffer,
  ContentType: string
}

export class ResourceRepository {
  constructor(
    private readonly logger: Logger,
    private readonly storage: StorageRepository
  ) {
  }

  async getTemplateFolder(templateId: string) {
    if (await this.storage.pathExists(`listed/${templateId}`)) {
      return `listed/${templateId}`
    } else if (await this.storage.pathExists(`unlisted/${templateId}`)) {
      return `unlisted/${templateId}`
    }

    return undefined
  }

  async getText(templateId: string, type: string, file: string): Promise<TextResourceContent | null> {
    const templateFolder = await this.getTemplateFolder(templateId)
    const fileName = `${templateFolder}/${type}/${file}`
    this.logger.debug(`getting file: ${fileName}`)

    try {
      return await this.storage.getTextFile(fileName)
    } catch {
      return null
    }
  }

 async getBinary(templateId: string, type: string, file: string): Promise<BinaryResourceContent | null> {
    const templateFolder = await this.getTemplateFolder(templateId)
    const fileName = `${templateFolder}/${type}/${file}`
    this.logger.debug(`getting file: ${fileName}`)

    try {
      return await this.storage.getBinaryFile(fileName)
    } catch {
      return null
    }
  }

  async list(templateId: string, type: string): Promise<string[]> {
    const templateFolder = await this.getTemplateFolder(templateId)
    const folder = `${templateFolder}/${type}`
    this.logger.debug(`listing files: ${folder}`)
    return (await this.storage.listFiles(folder)).map((file) => {
      return `${folder}/${file}`
    })
  }
}
