// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import {Bounds, sceneVisit as VegaSceneVisit} from 'vega'
import { AxisRole, MarkStager, MarkStagerOptions } from './interfaces'
import { Scene, SceneLine } from 'vega-typings'
import { zSwap } from './zaxis'
import { GroupItem, LineData } from './line'
import { Stage } from '../stagers/SceneToStage'
import { fromString } from '@hopara/encoding/src/color/Colors'
import { getStrokeColor } from './colors'

const lineZ = -1

function styledLine(
  options: MarkStagerOptions,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  strokeWidth: number,
  bounds: Bounds,
  role?: AxisRole) {
  const line: LineData = {
    bounds,
    sourcePosition: [x1, y1, lineZ],
    targetPosition: [x2, y2, lineZ],
    color: fromString(stroke),
    strokeWidth,
    role,
  }
  return line
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number) => {
  VegaSceneVisit(scene, function(item: SceneLine | any) {
    const x1 = item.x || 0
    const y1 = item.y || 0
    const x2 = item.x2 != null ? item.x2 : x1
    const y2 = item.y2 != null ? item.y2 : y1
    
    const lineItem = styledLine(options, x1, y1 + y, x2, y2 + y, item.stroke, item.strokeWidth, item.bounds, options.currAxis?.role)
    
    if (item.mark.role === 'axis-tick' && options.currAxis) {
      if (options.currAxis.role === 'z') {
        zSwap(lineItem.sourcePosition)
        zSwap(lineItem.targetPosition)
      }
      options.currAxis.ticks.push(lineItem)
    } else if (item.mark.role === 'axis-domain' && options.currAxis) {
      if (options.currAxis.role === 'z') {
        zSwap(lineItem.sourcePosition)
        zSwap(lineItem.targetPosition)
      }
      options.currAxis.domain = lineItem
    } else if (item.mark.role === 'mark') {
      const g = {
        opacity: 1,
        strokeOpacity: 1,
        strokeWidth: 1,
        ...(<Partial<GroupItem>>scene.items[0]),
      } as GroupItem
      
      stage.path?.push({
        strokeWidth: g.strokeWidth,
        strokeColor: getStrokeColor(g),
        positions: [lineItem.sourcePosition, lineItem.targetPosition],
      })
    } else if (stage.gridLines) {
      stage.gridLines.push(lineItem)
    }
  })
}

export function box(
  options: MarkStagerOptions,
  gx: number,
  gy: number,
  height: number,
  width: number,
  stroke: string,
  strokeWidth: number,
  bounds: Bounds,
  diagonals = false) {
  const lines = [
    styledLine(options, gx, gy, gx + width, gy, stroke, strokeWidth, bounds),
    styledLine(options, gx + width, gy, gx + width, gy + height, stroke, strokeWidth, bounds),
    styledLine(options, gx + width, gy + height, gx, gy + height, stroke, strokeWidth, bounds),
    styledLine(options, gx, gy + height, gx, gy, stroke, strokeWidth, bounds),
  ]
  if (diagonals) {
    lines.push(styledLine(options, gx, gy, gx + width, gy + height, stroke, strokeWidth, bounds))
    lines.push(styledLine(options, gx, gy + height, gx + width, gy, stroke, strokeWidth, bounds))
  }
  return lines
}

export default markStager
