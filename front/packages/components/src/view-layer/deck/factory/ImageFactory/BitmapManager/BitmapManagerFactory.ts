import {ResolutionBitmapManager} from './ResolutionBitmapManager'
import { ImageEncoding } from '@hopara/encoding'
import { FixedResolutionBitmapManager } from './FixedResolutionBitmapManager'

export class BitmapManagerFactory {
  static getManager(imageEncoding: ImageEncoding, maxTextureSize: number, isOrthographic:boolean) {
    if ( imageEncoding.resolution ) {
      return new FixedResolutionBitmapManager(imageEncoding.resolution)
    }

    return new ResolutionBitmapManager(maxTextureSize, isOrthographic)
  }
}
