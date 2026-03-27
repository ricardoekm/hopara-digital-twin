import { LayerTemplates } from '../domain/LayerTemplate'

export class LayerTemplateStore {
  layerTemplates: LayerTemplates
  loading: boolean

  constructor(props: Partial<LayerTemplateStore> = {}) {
    this.layerTemplates = props.layerTemplates ?? new LayerTemplates()
    this.loading = props.loading ?? false
  }

  immutableSetLoading(loading: boolean) {
    return new LayerTemplateStore({layerTemplates: this.layerTemplates, loading})
  }

  immutableSetItems(items: LayerTemplates) {
    return new LayerTemplateStore({
      layerTemplates: items?.sort((a, b) => a.name.localeCompare(b.name)),
      loading: this.loading,
    })
  }
}
