import { MarkStager, MarkStagerOptions } from './interfaces'
import { Datum, Scene, SceneGroup } from 'vega-typings'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Position } from '@deck.gl/core/utils/positions'
import { AxisRole } from './interfaces'
import { Stage } from '../stagers/SceneToStage'
import { Bounds } from 'vega'
import { getStrokeColor } from './colors'
import { isNil } from 'lodash/fp'

export interface PathData {
  positions: Position[]
  strokeColor: RGBAColor
  strokeWidth: number
}

export interface LineData {
  bounds: Bounds
  color?: RGBAColor
  sourcePosition: Position
  strokeWidth?: number
  targetPosition: Position
  role?: AxisRole
}

export type GroupItem = SceneGroup & {
  datum: Datum;
  length: number;
  depth: number;
  opacity: number;
  z: number;
  strokeWidth: number,
  strokeOpacity: number;
}

const splitIntoGroups = (scene: Scene) => {
  return scene.items.reduce((acc: any[], it: any) => {
    const currentGroup = acc.length - 1
    const shouldCreateNewGroup = isNil(it.x) || isNil(it.y)

    if (shouldCreateNewGroup) {
      acc.push([])
    } else {
      acc[currentGroup].push(it)
    }

    return acc
  }, [[]])
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene) => {
  const g = {
    opacity: 1,
    strokeOpacity: 1,
    strokeWidth: 1,
    ...(<Partial<GroupItem>>scene.items[0]),
  } as GroupItem

  const positionGroups = splitIntoGroups(scene)

  positionGroups.forEach((positions: any) => {
    stage.path?.push({
      strokeWidth: g.strokeWidth,
      strokeColor: getStrokeColor(g),
      positions: positions.map((it: any) => [it.x, it.y, it.z || 0]) as any,
    })
  })
}

export default markStager
