import {promises as fs} from 'fs'
import path from 'path'
import {lookup} from 'mime-types'
import {StorageRepository} from '../StorageRepository'

export class FileSystemRepository implements StorageRepository {
  basePath: string

  constructor(fsConfig: {basePath: string}) {
    this.basePath = fsConfig.basePath
  }

  private resolvePath(target:string) {
    if (!target) return this.basePath
    return path.isAbsolute(target) ? target : path.resolve(this.basePath, target)
  }

  async pathExists(targetPath:string): Promise<boolean> {
    const fullPath = this.resolvePath(targetPath)
    try {
      await fs.access(fullPath)
      return true
    } catch {
      return false
    }
  }

  async listFiles(targetPath:string): Promise<string[]> {
    const fullPath = this.resolvePath(targetPath)
    try {
      const entries = await fs.readdir(fullPath, {withFileTypes: true})
      return entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
    } catch {
      return []
    }
  }

  async listFolders(targetPath:string): Promise<string[]> {
    const fullPath = this.resolvePath(targetPath)
    try {
      const entries = await fs.readdir(fullPath, {withFileTypes: true})
      return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    } catch {
      return []
    }
  }

  async getTextFile(filePath:string): Promise<{Data:string, ContentType:string}> {
    const fullPath = this.resolvePath(filePath)
    const data = await fs.readFile(fullPath, 'utf8')
    const contentType = this.detectContentType(filePath, 'text/plain')
    return {Data: data, ContentType: contentType}
  }

  private detectContentType(filePath:string, fallback:string) {
    const type = lookup(filePath)
    if (!type) return fallback
    return type
  }

  async getBinaryFile(filePath:string): Promise<{Data:Buffer, ContentType:string}> {
    const fullPath = this.resolvePath(filePath)
    const data = await fs.readFile(fullPath)
    const contentType = this.detectContentType(filePath, 'application/octet-stream')
    return {Data: data, ContentType: contentType}
  }

  async getJSONFile(filePath:string): Promise<any> {
    try {
      const file = await this.getTextFile(filePath)
      return JSON.parse(file.Data)
    } catch {
      return null
    }
  }
}
