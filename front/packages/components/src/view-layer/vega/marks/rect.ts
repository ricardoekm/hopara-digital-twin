import {Bounds, sceneVisit as VegaSceneVisit} from 'vega'
import { Datum, Scene, SceneRect } from 'vega-typings'
import { MarkStager, MarkStagerOptions } from './interfaces'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Position } from '@deck.gl/core/utils/positions'
import { Stage } from '../stagers/SceneToStage'
import {PolygonData} from './area'
import { getEnrichedData } from '../RowEnricher'
import { isNil } from 'lodash/fp'
import { UNIT_X_FIELD, UNIT_Y_FIELD } from '../transforms/VegaUnitTransform'
import { getFillColor, getStrokeColor } from './colors'

type SceneCube = SceneRect & {
  bounds: Bounds
  datum: Datum
  depth: number
  opacity: number
  z: number
}

// Cuboid information. The cube does not need to have equal dimensions.
export interface CubeData {
  /**
  * Ordinal position.
  */
  ordinal?: number
  
  /**
  * Flag whether this cube is a "placeholder" and is not to be rendered nor contains cube data.
  */
  isEmpty?: boolean
  
  color: RGBAColor
  position: Position
  size: Position
}

const min3dDepth = 0.05

const createRectPolygonData = (item) => {
  const polygon: PolygonData = {
    bounds: item.bounds,
    positions: [
      [item.bounds.x1 ?? 0, item.bounds.y1 ?? 0, item.z ?? 0],
      [item.bounds.x2 ?? 0, item.bounds.y1 ?? 0, item.z ?? 0],
      [item.bounds.x2 ?? 0, item.bounds.y2 ?? 0, item.z ?? 0],
      [item.bounds.x1 ?? 0, item.bounds.y2 ?? 0, item.z ?? 0],
      [item.bounds.x1 ?? 0, item.bounds.y1 ?? 0, item.z ?? 0],
    ],
    fillColor: getFillColor(item),
    strokeColor: getStrokeColor(item),
    strokeWidth: item.strokeWidth,
    depth: item.depth,
    ...getEnrichedData(item.datum),
  }

  return polygon
}

const createCubeData = (item, ordinal, x, y): CubeData => {
  const depth = (item.depth || 0) + min3dDepth

  return {
    ordinal,
    size: [item.width, item.height, depth],
    position: [x + (item.x || 0), y + (item.y || 0), item.z || 0],
    color: getFillColor(item),
    ...getEnrichedData(item.datum),
  }
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x, y) => {
  VegaSceneVisit(scene, function(item: SceneCube | any) {
    const isUnitLayout = !isNil(item.datum[UNIT_X_FIELD]) && !isNil(item.datum[UNIT_Y_FIELD])
    if (isUnitLayout) {
      stage.cube?.push(createCubeData(item, true, x, y))
    } else {
      stage.polygon?.push(createRectPolygonData(item))
    }
  })
}

export default markStager
