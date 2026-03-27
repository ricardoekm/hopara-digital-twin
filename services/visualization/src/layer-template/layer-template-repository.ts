import {LayerSpec} from '../layer/domain/spec/Layer.js'

export interface LayerTemplate {
  id: string,
  name: string,
  image: string,
  layers: LayerSpec[],
  form: { path: string, defaultValue?: string, controlType?: string }[]
}

export interface LayerTemplateRepository {
  list(): Promise<LayerTemplate[]>;
}

