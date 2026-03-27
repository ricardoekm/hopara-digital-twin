import {sceneVisit as VegaSceneVisit} from 'vega'
import legend, {LegendData} from '../marks/legend'
import rect, {CubeData} from '../marks/rect'
import rule, {box} from '../marks/rule'
import line, {LineData, PathData} from '../marks/line'
import text, {TextData} from '../marks/text'
import area, {PolygonData} from '../marks/area'
import symbol, {CircleData} from '../marks/symbol'
import arc from '../marks/arc'

import {RGBAColor} from '@deck.gl/core/utils/color'
import {
  Arc,
  AxisData,
  AxisRole,
  AxisSceneGroup,
  FacetRect,
  GroupType,
  MarkStager,
  MarkStagerOptions,
} from '../marks/interfaces'
import {Orient, Scene, SceneGroup} from 'vega-typings'
import {fromString} from '@hopara/encoding/src/color/Colors'

export interface Stage {
  backgroundColor?: RGBAColor
  circle?: CircleData[]
  cube?: CubeData[]
  path?: PathData[]
  polygon?: PolygonData[]
  legend?: LegendData
  axes?: { x?: AxisData[], y?: AxisData[], z?: AxisData[] }
  text?: TextData[]
  gridLines?: LineData[]
  facets?: FacetRect[]
  arcs?: Arc[]
}

interface VegaAxisDatum {
  domain: boolean;
  grid: boolean;
  labels: boolean;
  orient: Orient;
  ticks: boolean;
  title: boolean;
}

function getOrientItem(group: AxisSceneGroup): { orient?: Orient; } {
  if (group.orient) {
    return group
  }
  return group.datum as VegaAxisDatum
}

function setCurrentAxis(options: MarkStagerOptions, stage: Stage, groupType?: GroupType) {
  let axes: AxisData[]
  let role: AxisRole
  switch (groupType) {
    case GroupType.xAxis:
      axes = stage.axes?.x ?? []
      role = 'x'
      break
    case GroupType.yAxis:
      axes = stage.axes?.y ?? []
      role = 'y'
      break
    case GroupType.zAxis:
      axes = stage.axes?.z ?? []
      role = 'z'
      break
    default:
      return
  }
  options.currAxis = {
    domain: null,
    tickText: [],
    ticks: [],
    role,
  }
  axes.push(options.currAxis)
}

function convertGroupRole(group: SceneGroup, options: MarkStagerOptions): GroupType | undefined {
  if (group.mark.role === 'legend') return GroupType.legend
  if (group.mark.role === 'axis') {
    if (((group as AxisSceneGroup).mark).zindex === options.zAxisZindex && options.zAxisZindex !== undefined) {
      return GroupType.zAxis
    }
    const orientItem = getOrientItem(group as AxisSceneGroup)
    if (orientItem) {
      switch (orientItem.orient) {
        case 'bottom':
        case 'top':
          return GroupType.xAxis
        case 'left':
        case 'right':
          return GroupType.yAxis
      }
    }
  }
}

const group: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType?: GroupType) => {
  VegaSceneVisit(scene, function(g: SceneGroup | any) {
    const gx = g.x || 0
    const gy = g.y || 0
    if (g.context && g.context.background && !stage.backgroundColor) {
      stage.backgroundColor = fromString(g.context.background)
    }
    if (g.stroke && stage.facets) {
      const facetRect: FacetRect = {
        datum: g.datum,
        lines: box(options, gx + x, gy + y, g.height, g.width, g.stroke, 1, g.bounds),
      }
      stage.facets.push(facetRect)
    }

    groupType = convertGroupRole(g, options) || groupType
    setCurrentAxis(options, stage, groupType)

    // draw group contents
    VegaSceneVisit(g, function(item: Scene | any) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mainStager(options, stage, item, gx + x, gy + y, groupType)
    })
  })
}

const markStagers: { [id: string]: MarkStager } = {
  group,
  legend,
  rect,
  rule,
  line,
  area,
  text,
  symbol,
  arc,
}

const mainStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType?: GroupType) => {
  if (scene?.marktype !== 'group' && groupType === GroupType.legend) {
    legend(options, stage, scene, x, y, groupType)
  } else if (markStagers[scene?.marktype]) {
    markStagers[scene.marktype](options, stage, scene, x, y, groupType)
  }
}

function orderDomain(domain: LineData, dim: number) {
  if (domain.sourcePosition[dim] > domain.targetPosition[dim]) {
    const temp = domain.targetPosition
    domain.targetPosition = domain.sourcePosition
    domain.sourcePosition = temp
  }
}

function sortAxis(axes: AxisData[], dim: number) {
  axes.forEach((axis) => {
    if (axis.domain) orderDomain(axis.domain, dim)
    axis.ticks.sort((a, b) => a.sourcePosition[dim] - b.sourcePosition[dim])
    axis.tickText.sort((a, b) => a.position[dim] - b.position[dim])
  })
}

export function sceneToStage(scene: Scene, options = {} as MarkStagerOptions): Stage {
  const stage: Stage = {
    circle: [],
    cube: [],
    path: [],
    polygon: [],
    axes: {x: [], y: [], z: []},
    gridLines: [],
    text: [],
    legend: {rows: {}},
    facets: [],
    arcs: [],
  }

  mainStager(options as MarkStagerOptions, stage, (scene as any).root as Scene, 0, 0)
  sortAxis(stage.axes?.x ?? [], 0)
  sortAxis(stage.axes?.y ?? [], 1)

  return stage
}
