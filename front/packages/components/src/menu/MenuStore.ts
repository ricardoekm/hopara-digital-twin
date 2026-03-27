import { isNil } from 'lodash/fp'
import {HoparaIconKey} from '@hopara/design-system/src/icons/Icon'

export interface MenuItem {
  id: string
  name: string
  icon?: HoparaIconKey
}

export class MenuStore {
  items: MenuItem[]
  selectedId: string | undefined
  loading = false

  constructor(props?: Partial<MenuStore>) {
    Object.assign(this, props)
    if (!this.items?.length) this.items = []
  }

  clone() {
    return new MenuStore({...this})
  }

  setItems(items: MenuItem[]) {
    const cloned = this.clone()
    cloned.items = items
    return cloned
  }

  setSelected(selectedId: string | undefined) {
    const cloned = this.clone()
    cloned.selectedId = selectedId
    return cloned
  }

  selectFirstItem() {
    return this.setSelected(this.items[0]?.id)
  }

  selectItem(id?: string) {
    if (id === this.selectedId) return this.clone()
    if (isNil(id) || !this.items.find((item) => item.id === id)) return this.setSelected(undefined)
    return this.setSelected(id)
  }

  unselectItem() {
    const cloned = this.clone()
    return cloned.setSelected(undefined)
  }

  hasItemWithId(id: string): boolean {
    return this.items.some((item) => item.id === id)
  }

  setLoading(loading: boolean) {
    const cloned = this.clone()
    cloned.loading = loading
    return cloned
  }
}
