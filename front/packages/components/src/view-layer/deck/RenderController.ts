export type ComparisonParams = {
  cacheKey?: string
  lastModified?: Date
}

export class RenderController {
  _shouldRender = true
  params:ComparisonParams = {}

  shouldRender() : boolean {
    if (this._shouldRender) {
      this._shouldRender = false
      return true
    }

    return false
  }

  update(params:ComparisonParams) : void {
    if (!params.cacheKey) {
      this._shouldRender = false
      return
    }

    // we'll guarantee that it rerender at least once before updating it again
    if (this._shouldRender) {
      this.params = params
      return
    }

    this._shouldRender = (params.cacheKey !== this.params.cacheKey) || (this.params.lastModified !== params.lastModified)

    this.params = params
  }
}
