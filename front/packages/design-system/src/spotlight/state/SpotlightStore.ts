export class SpotlightStore {
  elementId?: string

  constructor(props?: { elementId?: string, rect?: DOMRect }) {
    this.elementId = props?.elementId
  }

  setElementId(elementId?: string) {
    return new SpotlightStore({elementId})
  }

  clear() {
    return new SpotlightStore()
  }
}
