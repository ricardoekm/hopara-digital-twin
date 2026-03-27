import { OffsetExtension } from './offset/OffsetExtension'
import { LayerExtension } from 'lib'
import { isNil } from 'lodash'
import { PrecisionExtension } from './precision/PrecisionExtension'
import { AnimationExtension } from './animation/AnimationExtension'

const offsetExtension = OffsetExtension
const precisionExtension = PrecisionExtension
const animationExtension = AnimationExtension

export enum ExtensionType {
  offset = 'offset',
  precision = 'precision',
  animation = 'animation',
}

const extensionsMap = {
  'offset': offsetExtension,
  'precision': precisionExtension,
  'animation': animationExtension,
}

export class ExtensionsManager {
  static add(extensions:LayerExtension[], type:ExtensionType, opts?: any) : LayerExtension[] {
    if (isNil(extensions)) {
      extensions = []
    }

    const newExtensions = [...extensions]
    if (!newExtensions.find((e) => e instanceof extensionsMap[type])) {
      newExtensions.push(new extensionsMap[type](opts))
    }
    return newExtensions
  }
}
