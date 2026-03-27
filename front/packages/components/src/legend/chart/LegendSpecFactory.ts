import { Rows } from '@hopara/dataset'
import { Layer } from '../../layer/Layer'
import { Layers } from '../../layer/Layers'
import { VegaTranslator } from '../../view-layer/vega/translator/VegaTranslator'
import { Legends } from '../Legends'
import { VegaLayer } from '../../view-layer/vega/VegaLayer'
import { Rowsets } from '../../rowset/Rowsets'

export interface LegendsSpec {
  background: null
  height: number
  width: number
  layer: any[]
  config: any
}

const vegaTranslator = new VegaTranslator()

export class LegendSpecFactory {
  static getLayerSpec(layer: Layer, rows: Rows): VegaLayer[] {
    return vegaTranslator.translate(layer, rows)
  }

  static getRows(layer: Layer, rowsets: Rowsets) {
    const rowsetId = layer.getRowsetId()
    if (!rowsetId) {
      return new Rows()
    }

    const rowset = rowsets.getById(rowsetId)
    if (!rowset) {
      return new Rows()
    }

    return rowset.rows
  }

  static create(layers: Layers, legends: Legends, rowsets: Rowsets): LegendsSpec {
    const legendLayers = layers.filter((layer) => legends.hasLegend(layer.getId()))
      .filter((layer: Layer) => layer.isChart())
      .map((layer) => this.getLayerSpec(layer, this.getRows(layer, rowsets)))
      .flat()

    return {
      background: null,
      height: 0,
      width: 0,
      layer: legendLayers,
      config: {
        axis: null,
        legend: {
          symbolType: 'circle',
          symbolSize: 100,
          rowPadding: 8,
          labelOffset: 6,
        },
      },
    }
  }
}
