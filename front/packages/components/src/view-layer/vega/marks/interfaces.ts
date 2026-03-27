import { RGBAColor } from '@deck.gl/core/utils/color'
import { Mark, Orient, Scene, SceneGroup } from 'vega-typings'
import { Stage } from '../stagers/SceneToStage'
import { LineData } from './line'
import { TextData } from './text'
import { Bounds } from 'vega'

export enum GroupType {
  none = 0,
  legend = 1,
  xAxis = 2,
  yAxis = 3,
  zAxis = 4,
}

export interface MarkStagerOptions {
  maxOrdinal: number;
  currAxis: AxisData;
  defaultCubeColor: RGBAColor;
  assignCubeOrdinal: (d: object) => number | undefined;
  zAxisZindex: number;
}

// TODO - use vega-typings below
export type AxisSceneGroup = SceneGroup & {
  datum?: any;
  orient?: Orient;
  mark: Mark
};
export interface LabelDatum {
  value: any;
}
// TODO - use vega-typings above

export type MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number, groupType?: GroupType) => void;

export type AxisRole = 'x' | 'y' | 'z'

export interface TickText extends TextData {
  value: number | string
}

export interface AxisData {
  domain: LineData | null
  ticks: LineData[]
  tickText: TickText[]
  title?: TextData
  role?: AxisRole
}

// Rect area and title for a facet.
export interface FacetRect {
  datum: any
  lines: LineData[]
}

export interface Arc {
  bounds: Bounds
  color: RGBAColor
  position: [number, number, number]
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
}
