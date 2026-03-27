import React from 'react'
import {Layers} from '../layer/Layers'
import Visualization from '../visualization/Visualization'
import {VegaLegendComponent} from './chart/VegaLegendComponent'
import {GenericLegendComponent} from './GenericLegendComponent'
import {Queries} from '@hopara/dataset'
import {Legends} from './Legends'
import { Rowsets } from '../rowset/Rowsets'
import { PureComponent } from '@hopara/design-system'
import { getLegendLayer } from './LegendLayers'
import { Legend } from './Legend'

export type StateProps = {
  layers: Layers
  visualization: Visualization
  rowsets: Rowsets
  queries: Queries
  legends: Legends
}

export class LegendComponent extends PureComponent<StateProps> {
  isCustomLegend(): boolean {
    const legendLayer = getLegendLayer(this.props.layers, this.props.legends, this.props.rowsets)
    if (!legendLayer) {
      return false
    }

    const legend = this.props.legends.find((l) => l.layer === legendLayer.getId()) as Legend
    return !!legend.items && legend.items.length > 0
  }

  render() {
    if (this.isCustomLegend()) {
      return <GenericLegendComponent {...this.props} />
    }

    if (this.props.visualization?.isChart()) {
      return <VegaLegendComponent {...this.props} />
    }
    return <GenericLegendComponent {...this.props} />
  }
}
