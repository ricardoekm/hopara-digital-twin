import {Store} from '../../state/Store'

export const shouldRenderLayerEditor = (store: Store): boolean => {
  return !!store.layerStore.getSelectedLayer()
}
