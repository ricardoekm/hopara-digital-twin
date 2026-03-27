import { maxBy } from 'lodash/fp'
import { Stage } from './stagers/SceneToStage'
import { Dimensions } from '@hopara/spatial'
import { AxesDimensions } from '../../chart/domain/AxesDimension'

const getAxesUnitDimensions = (axes: any[], unitName: string, role: string) => {
  const units = axes.map((a) => a[unitName]).flat().filter((t) => !!t)
  const unitSizes = units.map((t) => ({
    width: t.bounds.width() as number,
    height: t.bounds.height() as number,
  }))

  const dimension = role === 'x' ? 'width' : 'height'
  return maxBy(dimension, unitSizes) ?? {width: 0, height: 0}
}

const getAxesDimesions = (axes: any[], role: 'x' | 'y') => {
  const domainLineDimensions = getAxesUnitDimensions(axes, 'domain', role)
  const ticksDimensions = getAxesUnitDimensions(axes, 'ticks', role)
  const tickTextDimensions = getAxesUnitDimensions(axes, 'tickText', role)
  const titleDimensions = getAxesUnitDimensions(axes, 'title', role)

  const dimesions = [domainLineDimensions, ticksDimensions, tickTextDimensions, titleDimensions].reduce((acc, unitDimensions) => {
    if (role === 'x') {
      return {
        width: Math.max(acc.width + unitDimensions.width),
        height: acc.height + unitDimensions.height,
      }
    }

    return {
      width: acc.width + unitDimensions.width,
      height: Math.max(acc.height, unitDimensions.height),
    }
  }, {width: 0, height: 0} as Dimensions)

  return {
    width: dimesions.width ? dimesions.width + 8 : 0,
    height: dimesions.height ? dimesions.height + 8 : 0,
  }
}

export const getAxesDimensions = (stage: Stage) : AxesDimensions => {
  return {
    x: stage?.axes?.x ? getAxesDimesions(stage.axes.x, 'x') : {width: 0, height: 0},
    y: stage?.axes?.y ? getAxesDimesions(stage.axes.y, 'y') : {width: 0, height: 0},
  }
}
