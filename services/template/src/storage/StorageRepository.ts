export interface StorageRepository {
  pathExists(path:string): Promise<boolean>
  listFiles(path:string): Promise<string[]>
  listFolders(path: string): Promise<string[]>
  getTextFile(filePath:string): Promise<{Data:string, ContentType:string}>
  getBinaryFile(filePath:string): Promise<{Data:Buffer, ContentType:string}>
  getJSONFile(filePath:string): Promise<any>
}
