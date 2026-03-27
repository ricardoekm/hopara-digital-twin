import { Transform, TransformType } from '@hopara/encoding'

export abstract class FrontOnlyTransform implements Transform {
  type: TransformType

  abstract getParams() : Object

  isRowProcessing(): boolean {
    return true
  }

  isFrontOnly(): boolean {
      return true
  }

  isRowPlacing(): boolean {
      return false
  }

  isFetchable(): boolean {
      return true
  }

  isZoomBased(): boolean {
      return true
  }
}
