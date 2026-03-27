import {sceneVisit as VegaSceneVisit} from 'vega'
import {
  LabelDatum,
  MarkStager,
  MarkStagerOptions,
} from './interfaces'
import {
  Scene,
  SceneItem,
  SceneLegendItem,
  SceneSymbol,
  SceneText,
} from 'vega-typings'
import { Stage } from '../stagers/SceneToStage'

export interface LegendRowSymbol {
  bounds: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  fill: string
  shape: string
}

export interface LegendRow {
  label?: string
  value?: string
  symbol?: LegendRowSymbol
}

export interface LegendData {
  title?: string
  rows: { [index: number]: LegendRow }
}

const legendMap = {
  'legend-title': (legend: LegendData, textItem: SceneText) => {
    legend.title = textItem.text
  },
  
  'legend-symbol': (legend: LegendData, symbol: SceneSymbol & SceneLegendItem) => {
    const { bounds, fill, shape } = symbol
    // this object is safe for serialization
    const legendRowSymbol: LegendRowSymbol = { bounds, fill, shape }
    const i = symbol.datum.index
    legend.rows[i] = legend.rows[i] || {}
    legend.rows[i].symbol = legendRowSymbol
  },
  
  'legend-label': (legend: LegendData, label: SceneText & SceneLegendItem) => {
    const i = label.datum.index
    legend.rows[i] = legend.rows[i] || {}
    const row = legend.rows[i]
    row.label = label.text
    row.value = (label.datum as unknown as LabelDatum).value
  },
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene) => {
  VegaSceneVisit(scene, function(item: SceneItem | any) {
    const fn = legendMap[item.mark?.role]
    if (fn) {
      fn(stage.legend, item)
    } else {
      // console.log(`need to render legend ${item.mark.role}`);
    }
  })
}

export default markStager
