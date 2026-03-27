import { ImageResolution } from '@hopara/encoding'
import { BitmapManager } from './BitmapManager'

export class FixedResolutionBitmapManager implements BitmapManager {
  constructor(private resolution: ImageResolution) {}

  private setResolution(imageUrl: string) {
    const url = new URL(imageUrl)
    url.searchParams.delete('resolution')
    url.searchParams.append('resolution', this.resolution)
    return url.toString()
  }

  getLoadUrl(imageUrl: string): string {
    return this.setResolution(imageUrl).toString()
  }
}
