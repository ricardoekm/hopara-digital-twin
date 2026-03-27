import { Layer } from 'deck.gl'
import { AxisData, TickText } from '../../marks/interfaces'
import { LineData } from '../../marks/line'
import { TextData } from '../../marks/text'
import { Stage } from '../../stagers/SceneToStage'
import { createLineLayer } from '../LineLayerFactory'
import { createTextLayer } from '../TextLayerFactory'
import { FactoryProps } from '../BaseFactory'

const layerIds = {
  lines: 'VEGA_LAYER_LINES',
  text: 'VEGA_LAYER_TEXT',
}

export function createAxesDomainLayers(stage: Stage, props: FactoryProps): Layer<any>[] {
  const { x, y, z } = stage.axes as {x: AxisData[], y: AxisData[], z: AxisData[]}
  return [x, y, z].map((axes, i) => {
    const lines: LineData[] = []
    const texts: (TickText | TextData)[] = []
    const gridLines: LineData[] = []
    const role = i === 0 ? 'X' : i === 1 ? 'Y' : 'Z'
    
    axes.forEach((axis) => {
      if (axis.domain) lines.push(axis.domain)
      if (axis.title) texts.push(axis.title)
    })
    
    const layerPrefix = 'AXIS_' + role + '_DOMAIN_'
    const axisProps = {...props, targetView: props.targetView}
    const lineLayer = createLineLayer(layerPrefix + layerIds.lines, lines, axisProps)
    const gridLineLayer = createLineLayer(layerPrefix + 'GRID_' + layerIds.lines, gridLines, axisProps)
    const textLayer = createTextLayer(layerPrefix + layerIds.text, texts, axisProps, {})
    return [textLayer, lineLayer, gridLineLayer]
  }).flat()
}

export function createAxesTicksLayers(stage: Stage, props: FactoryProps): Layer<any>[][] {
  const { x, y, z } = stage.axes as {x: AxisData[], y: AxisData[], z: AxisData[]}
  return [x, y, z].map((axes, i) => {
    const lines: LineData[] = []
    const texts: (TickText | TextData)[] = []
    const gridLines: LineData[] = []
    const role = i === 0 ? 'X' : i === 1 ? 'Y' : 'Z'
    
    axes.forEach((axis) => {
      if (stage.gridLines?.length) {
        const filtereds = stage.gridLines?.filter((line) => line.role === axis.role)
        filtereds.forEach((gridLine) => gridLines.push(gridLine))
      }
      if (axis.ticks) axis.ticks.forEach((tickLine) => lines.push(tickLine))
      if (axis.tickText) axis.tickText.forEach((text) => texts.push(text))
    })
    
    const layerPrefix = 'AXIS_' + role + '_TICKS_'
    const axisProps = {...props, targetView: `${props.targetView}-${role.toLowerCase()}`}
    const lineLayer = createLineLayer(layerPrefix + layerIds.lines, lines, {...axisProps, targetView: `${axisProps.targetView}-lines`})
    const gridLineLayer = createLineLayer(layerPrefix + 'GRID_' + layerIds.lines, gridLines, {...axisProps, targetView: `${axisProps.targetView}-lines`})
    const textLayer = createTextLayer(layerPrefix + layerIds.text, texts, axisProps, {})
    return [textLayer, lineLayer, gridLineLayer]
  })
}
