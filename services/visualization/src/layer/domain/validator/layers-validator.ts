import {LayerValidator} from './layer-validator.js'
import LayerImpl from '../LayerImpl.js'
import { ColumnsMap } from '../../../data/ColumnsMap.js'
import { ValidationError } from '../../../validation.js'

export class LayersValidator {
  constructor(private layerValidator: LayerValidator) {
  }

  async validate(layers: LayerImpl[], columnsMap: ColumnsMap): Promise<ValidationError[]> {
    return (await Promise.all(layers.map(async (layer) => {
      return this.layerValidator.validate(layer, layers, columnsMap)
    }))).flat()
  }
}
