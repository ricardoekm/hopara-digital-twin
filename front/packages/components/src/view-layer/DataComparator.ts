import {ComparisonParams, RenderController} from './deck/RenderController'

type RenderControllerMap = {
  [layerId: string]: RenderController
}

export class DataComparator {
  private renderControllers: RenderControllerMap = {}

  private getRenderController(layerId: string) {
    if (!this.renderControllers[layerId]) {
      this.renderControllers[layerId] = new RenderController()
    }
    return this.renderControllers[layerId]
  }
  
  update(layerId: string, params: ComparisonParams) {
    const controller = this.getRenderController(layerId)
    controller.update(params)
  }

  updateFromLayer(layerId:string, targetLayerId:string) {
    const targetController = this.getRenderController(targetLayerId)
    const sourceController = this.getRenderController(layerId)
    targetController.update(sourceController.params)
  }

  // Data comparator should return true if values are equal false otherwise
  // https://github.com/visgl/deck.gl/blob/bf14ca00cdbecef8842bd16f8491aabc7be209ab/docs/api-reference/core/layer.md#datacomparator-function-optional
  isEqual(layerId: string) {
    const controller = this.getRenderController(layerId)
    return () => !controller.shouldRender()
  }
}
