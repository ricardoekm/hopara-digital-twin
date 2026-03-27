import { Position3D } from '@deck.gl/core'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Position } from '@deck.gl/core/utils/positions'
import { MarkStager, MarkStagerOptions } from './interfaces'
import { Datum, Scene, SceneGroup } from 'vega-typings'
import { Stage } from '../stagers/SceneToStage'
import { Bounds } from 'vega'
import { getFillColor, getStrokeColor } from './colors'

export interface PolygonData {
  bounds: Bounds
  positions: Position[]
  strokeColor: RGBAColor
  fillColor: RGBAColor
  strokeWidth: number
  depth: number
}

type GroupItem = SceneGroup & {
  datum: Datum;
  length: number;
  depth: number;
  opacity: number;
  fillOpacity: number;
  fill: string;
  strokeOpacity: number;
  strokeWidth: number;
  z: number;
  z2: number;
  x2: number;
  y2: number;
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene) => { 
  const g = {
    fillOpacity: 1,
    opacity: 1,
    strokeOpacity: 1,
    strokeWidth: 0,
    depth: 0,
    ...(<Partial<GroupItem>>scene.items[0]),
  } as GroupItem
  
  const points = scene.items.map((groupItem: Partial<GroupItem>) => {
    const item = { z: 0, x2: groupItem.x, y2: groupItem.y, z2: groupItem.z, ...groupItem} as GroupItem
    return [
      (item.x ?? 0),
      (item.y ?? 0),
      (item.z ?? 0),
      (item.x2 ?? 0),
      (item.y2 ?? 0),
      (item.z2 ?? 0),
    ]
  })

  const positions: Position3D[] = []
  const startpoint: Position3D = [points[0][0], points[0][1], points[0][2]]
  points.forEach((p) => positions.push([p[0], p[1], p[2]]))
  points.reverse().forEach((p) => positions.push([p[3], p[4], p[5]]))
  positions.push(startpoint)
  
  stage.polygon?.push({
    bounds: g.bounds,
    positions,
    fillColor: getFillColor(g),
    strokeColor: getStrokeColor(g),
    strokeWidth: g.strokeWidth,
    depth: g.depth,
  })
}

export default markStager
