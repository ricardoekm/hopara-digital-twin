import {ResourceFetch, ResourceType} from '../fetch'
import {PlaceHolderTypes} from '../placeholder'
import NotFound from '../placeholder/image-not-found.png'
import NotFoundCanvas from '../placeholder/image-not-found-canvas.png'
import Processing from '../placeholder/image-processing.png'
import ProcessingCanvas from '../placeholder/image-processing-canvas.png'

export class ImageFetch extends ResourceFetch {
  constructor() {
    super()
    this.resourceType = ResourceType.image
  }

  protected resolveResolutionParam(url: URL, webGLMaxTextureSize?: number): URL {
    if (webGLMaxTextureSize) {
      url.searchParams.delete('max-size')
      url.searchParams.append('max-size', webGLMaxTextureSize.toString())
    }

    return url
  }

  public getPlaceholder(type: PlaceHolderTypes): any {
    switch (type) {
      case PlaceHolderTypes.NOT_FOUND:
        return NotFound
      case PlaceHolderTypes.NOT_FOUND_CANVAS:
        return NotFoundCanvas
      case PlaceHolderTypes.PROCESSING:
        return Processing
      case PlaceHolderTypes.PROCESSING_CANVAS:
        return ProcessingCanvas
      default:
        return NotFound
    }
  }
}
