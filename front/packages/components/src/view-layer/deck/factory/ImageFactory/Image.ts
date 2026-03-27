export class Image {
  id: string
  fallback: string
  library: string
  view: string
  tenant: string
  resolution?: string
  version?: Date | undefined

  constructor(props: Partial<Image>) {
    Object.assign(this, props)
  }

  imageId: string

  getId() {
    if (this.imageId) return this.imageId
    this.imageId = [this.id + this.fallback + this.library + this.view + this.tenant + this.version + this.resolution].join('#')
    return this.imageId
  }
}
