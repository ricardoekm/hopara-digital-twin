import {ResourceType, ResourceFetch} from '../fetch'
import {PlaceHolderTypes} from '../placeholder'
import NotFound from '../placeholder/model-not-found.png'
import NotFoundCanvas from '../placeholder/model-not-found.glb'
import Processing from '../placeholder/model-processing.png'
import ProcessingCanvas from '../placeholder/model-processing.glb'

export class ModelFetch extends ResourceFetch {
  constructor() {
    super()
    this.resourceType = ResourceType.model
  }

  protected resolveResolutionParam(url: URL): URL {
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
        return NotFoundCanvas
    }
  }
}
