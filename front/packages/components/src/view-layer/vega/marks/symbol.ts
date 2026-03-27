// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import {Bounds, sceneVisit as VegaSceneVisit} from 'vega'
import { Scene } from 'vega-typings'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Position } from '@deck.gl/core/utils/positions'
import { MarkStager, MarkStagerOptions } from './interfaces'
import { SceneItem } from 'vega'
import { Stage } from '../stagers/SceneToStage'
import { fromString } from '@hopara/encoding/src/color/Colors'
import { getEnrichedData } from '../RowEnricher'

export interface CircleData {
  bounds: Bounds
  color: RGBAColor
  position: Position
  size: number
  metaData?: any
  strokeColor: RGBAColor
  strokeWidth: number
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene) => {
  VegaSceneVisit(scene, function(item: SceneItem | any) {
    const z = (item.z || 0)

    if (item.shape === 'circle' && stage.circle) {
      stage.circle.push({
        bounds: item.bounds,
        size: item.size,
        position: [item.x || 0, item.y || 0, z || 0],
        color: item.fill && item.fill !== 'transparent' ? fromString(item.fill, item.opacity) : [0, 0, 0, 0],
        strokeWidth: item.strokeWidth,
        strokeColor: item.stroke && item.stroke !== 'transparent' ? fromString(item.stroke, item.opacity) : [0, 0, 0, 0],
        ...getEnrichedData(item.datum),
      })
    }
  })
}

export default markStager
