import { Column, Queries } from '@hopara/dataset'
import { Layers } from '../layer/Layers'
import { PositionScaleType, getPositionScaleType } from '@hopara/encoding'
import { LayerType } from '../layer/LayerType'

export class PositionScaleFactory {
  static getReferenceLayer(layers:Layers) {
    const lineLayers = layers.filter((layer) => layer.isType(LayerType.line))
    if (lineLayers.length > 0) {
      return lineLayers[0]
    }

    const fullPositionLayers = layers.filter((layer) => layer.encoding.position?.x?.field && 
                                                        layer.encoding.position?.y?.field)
    if (fullPositionLayers.length > 0) {
      return fullPositionLayers[0]
    }

    return layers[0]
  }

  static fromColumns(xColumn?:Column, yColumn?:Column) {
    return {
      x: getPositionScaleType(xColumn),
      y: getPositionScaleType(yColumn),
    }
  }

  static fromLayers(layers: Layers, queries: Queries) {
    if (layers.length > 0 && queries.length > 0) {
      const referenceLayer = this.getReferenceLayer(layers)
      const query = queries.findQuery(referenceLayer.getQueryKey())
      if (query) {
        const xColumn = query.columns.get(referenceLayer.encoding.position?.x?.field)
        const yColumn = query.columns.get(referenceLayer.encoding.position?.y?.field)

        return this.fromColumns(xColumn, yColumn)
      }
    }

    return {
      x: PositionScaleType.LINEAR,
      y: PositionScaleType.LINEAR,
    }
  }
}
