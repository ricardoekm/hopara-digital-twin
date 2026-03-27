// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import {Bounds, sceneVisit as VegaSceneVisit, truncate as VegaTruncate} from 'vega'
import { RGBAColor } from '@deck.gl/core/utils/color'
import { Position } from '@deck.gl/core/utils/positions'
import { AlignmentBaseline, TextAnchor } from '@deck.gl/layers/text-layer/text-layer'
import {
  LabelDatum,
  MarkStager,
  MarkStagerOptions,
  TickText,
} from './interfaces'
import {
  Scene,
  SceneText,
  SceneTextAlign,
  SceneTextBaseline,
} from 'vega-typings'
import { zSwap } from './zaxis'
import { Stage } from '../stagers/SceneToStage'
import { getFillColor } from './colors'

export interface TextData {
  bounds: Bounds,
  color: RGBAColor
  text: string
  position: Position
  size: number
  angle?: number
  textAnchor?: TextAnchor
  alignmentBaseline?: AlignmentBaseline
  metaData?: any
}

interface SceneText2 extends SceneText {
  metaData?: any;
  ellipsis?: string;
  limit?: number;
}

function convertAngle(vegaTextAngle: number) {
  if (vegaTextAngle && !isNaN(vegaTextAngle)) {
    return 360 - vegaTextAngle
  }
  return 0
}

function convertAlignment(textAlign: SceneTextAlign): TextAnchor {
  switch (textAlign) {
    case 'center': return 'middle'
    case 'left': return 'start'
    case 'right': return 'end'
  }
  return 'start'
}

const convertBaseline = (baseline: SceneTextBaseline): AlignmentBaseline => {
  switch (baseline) {
    case 'middle': return 'center'
  }
  return baseline || 'bottom'
}

const getTickText = (textItem: TextData, item: SceneText2, yOffset: number, options: MarkStagerOptions): TickText => {
  const tickText = {...textItem} as TickText
  tickText.value = (item.datum as LabelDatum).value
  if (options.currAxis.role === 'x') {
    textItem.position[0] = (item.x || 0)
  } else if (options.currAxis.role === 'y') {
    textItem.position[1] = (item.y || 0) + yOffset
  } else if (options.currAxis.role === 'z') {
    zSwap(tickText.position)
  }
  return tickText
}

const getTitleText = (textItem: TextData, options: MarkStagerOptions) => {
  const titleText = {...textItem} as TextData
  if (options.currAxis.role === 'y') {
    titleText.position[0] = titleText.position[0] - 6
  } else if (options.currAxis.role === 'x') {
    titleText.position[1] = titleText.position[1] - 6
  } else if (options.currAxis.role === 'z') {
    zSwap(titleText.position)
  }
  return titleText
}

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene, x: number, y: number) => {
  const fontScale = 1

  VegaSceneVisit(scene, function(item: SceneText2 | any) {
    if (!item.text) return
    const alignmentBaseline = convertBaseline(item.baseline)
    const yOffset = alignmentBaseline === 'top' ? item.fontSize / 2 : 0 // fixup to get tick text correct
    const textItem: TextData = {
      bounds: item.bounds,
      color: getFillColor(item),
      // use dots instead of unicode ellipsis for deck.gl's default font atlas
      text: item.limit === undefined ? item.text : VegaTruncate(item.text, item.limit, 'right', item.ellipsis || '...'),
      position: [x + (item.x || 0), y + (item.y || 0) + yOffset, 0],
      size: item.fontSize * fontScale,
      angle: convertAngle(item.angle),
      textAnchor: convertAlignment(item.align),
      alignmentBaseline,
      metaData: item.metaData,
    }

    if (item.mark.role === 'axis-label') {
      const tickText = getTickText(textItem, item, yOffset, options)
      options.currAxis.tickText.push(tickText)
    } else if (item.mark.role === 'axis-title') {
      const titleText = getTitleText(textItem, options)
      options.currAxis.title = titleText
    } else if (stage.text) {
      stage.text.push(textItem)
    }
  })
}

export default markStager
