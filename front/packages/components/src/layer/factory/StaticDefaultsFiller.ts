import { merge, omit } from 'lodash/fp'
import { Layer } from '../Layer'
import { LayerDefaults } from '../LayerDefaults'
import { LayerType } from '../LayerType'

// Defaults that come from the viz API
export class StaticDefaultsFiller {
  layerDefaults?: LayerDefaults

  constructor(layerDefaults?: LayerDefaults) {
    this.layerDefaults = layerDefaults
  }

  fillStaticDefaults(plainLayer:Partial<Layer>) {
    if (!this.layerDefaults) {
      return plainLayer
    }

    let defaults = this.layerDefaults[plainLayer.type as LayerType]
    // TODO: Remove when range gets priority over scheme    
    if (plainLayer.encoding?.color?.scale?.colors) {
      defaults = omit(['encoding.color.scale.scheme'], defaults)
    }

    // We need to transform encodings to plain for the merge to work
    const mergedLayer = merge(defaults, {...plainLayer, encoding: {...plainLayer.encoding}})
    return mergedLayer
  }
}
