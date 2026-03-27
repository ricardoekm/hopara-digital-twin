import { Column } from '@hopara/dataset'
import { ColorScaleType, scaleTypeEquals } from './ScaleType'
import { HashedScaleBehavior } from './HashedScaleBehavior'
import { SortedScaleBehavior } from './SortedScaleBehavior'
import { ScaleBehavior } from '../../scale/ScaleBehavior'
import { GroupedScaleBehavior } from './GroupedScaleBehavior'
import { QuantizeScaleBehavior } from './QuantizeScaleBehavior'

export type ScaleBehaviorInput = {
  type?: ColorScaleType,
  column?: Column,
  domain?: string[] | number[],
  colors?: any[]
}

function getDefaultScaleBehavior(field: string, input:ScaleBehaviorInput): ScaleBehavior {
  if (input.column?.isQuantitative() || input.column?.isTemporal()) {
    return new GroupedScaleBehavior(field)
  } else {
    return new SortedScaleBehavior(field)
  }
}

export function createScaleBehavior(field:string, input:ScaleBehaviorInput): ScaleBehavior {
  if (!input.type) {
    return getDefaultScaleBehavior(field, input)
  }

  if (scaleTypeEquals(input.type, ColorScaleType.LINEAR)) {
    return new QuantizeScaleBehavior(field)
  }
  if (scaleTypeEquals(input.type, ColorScaleType.GROUPED)) {
    return new GroupedScaleBehavior(field)
  } else if (scaleTypeEquals(input.type, ColorScaleType.SORTED)) {
    return new SortedScaleBehavior(field)
  } else if (scaleTypeEquals(input.type, ColorScaleType.HASHED)) {
    return new HashedScaleBehavior()
  }

  return new SortedScaleBehavior(field)
}
