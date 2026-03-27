export class HelperItem {
  dismissed: boolean
  count: number

  constructor(props?: Partial<HelperItem>) {
    this.dismissed = props?.dismissed || false
    this.count = props?.count || 0
  }

  shouldHide() {
    return this.dismissed || this.count >= 4
  }
}

export type HelperItems = {[key: string]: HelperItem}
export class LayerHelperStore {
  items: HelperItems

  constructor(props?: Partial<LayerHelperStore>) {
    this.items = props?.items || {}
  }

  clone() {
    return new LayerHelperStore({...this})
  }

  setDismissed(layerId: string) {
    const cloned = this.clone()
    cloned.items = {
      ...cloned.items,
      [layerId]: new HelperItem({
        ...cloned.items[layerId],
        dismissed: true,
      }),
    }
    return cloned
  }

  setLoadCount(layerId: string) {
    const cloned = this.clone()
    const previous = cloned.items[layerId] || {count: 0}
    cloned.items = {
      ...cloned.items,
      [layerId]: new HelperItem({
        ...previous,
        count: previous.count + 1,
      }),
    }
    return cloned
  }

  resetLayer(layerId: string) {
    const cloned = this.clone()
    const items = {...cloned.items}
    delete items[layerId]
    cloned.items = items
    return cloned
  }

  setInitialViewedCounts(initState: HelperItems = {}) {
    const cloned = this.clone()
    cloned.items = Object.keys(initState).reduce((acc, layerId) => {
      return {
        ...acc,
        [layerId]: new HelperItem({
          count: initState[layerId].count,
          dismissed: !!initState[layerId].dismissed,
        }),
      }
    }, {} as HelperItems)
    return cloned
  }
}
