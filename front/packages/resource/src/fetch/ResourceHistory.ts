export interface ResourceHistoryItem {
  version: number;
  editedAt: Date;
  editedBy?: string;
}

export class ResourceHistory {
  loading: boolean
  items: ResourceHistoryItem[]
  currentVersion?: number
  lastModified?: Date
  library?: string
  resourceId?: string

  layerId?: string
  rowId?: string

  constructor(props?: Partial<ResourceHistory>) {
    Object.assign(this, props)
    if (!this.items) {
      this.items = []
    }
  }

  clone() {
    return new ResourceHistory(this)
  }

  clear() {
    return new ResourceHistory({lastModified: this.lastModified})
  }

  setItems(payload: ResourceHistoryItem[]) {
    const cloned = this.clone()
    cloned.items = payload
    return cloned
  }

  setLoading(loading: boolean) {
    const cloned = this.clone()
    cloned.loading = loading
    return cloned
  }

  setCurrentVersion(version?: number) {
    const cloned = this.clone()
    cloned.currentVersion = version
    cloned.lastModified = new Date()
    return cloned
  }

  setLibrary(library?: string) {
    const cloned = this.clone()
    cloned.library = library
    return cloned
  }

  setResourceId(id?: string) {
    const cloned = this.clone()
    cloned.resourceId = id
    return cloned
  }

  isSame(library?: string, imageId?: string) {
    return this.library === library && this.resourceId?.toString() === imageId?.toString()
  }

  setRowId(rowId?: string) {
    const cloned = this.clone()
    cloned.rowId = rowId
    return cloned
  }

  setLayerId(layerId?: string) {
    const cloned = this.clone()
    cloned.layerId = layerId
    return cloned
  }
}
