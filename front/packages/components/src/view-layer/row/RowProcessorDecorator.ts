import { LayerType } from '../../layer/LayerType'
import {BaseViewLayerProps } from '../LayerFactory'
import { LayerFactoryChain } from '../LayerFactoryChain'
import { RowProcessor } from './RowProcessor'

const LAYERS_TO_SNAP = [LayerType.circle, LayerType.icon, LayerType.text, LayerType.polygon]

export class RowProcessorDecorator<P extends BaseViewLayerProps> extends LayerFactoryChain<P> {
  rowProcessor: RowProcessor

  constructor(rowProcessor: RowProcessor) {
    super()
    this.rowProcessor = rowProcessor
  }
  
  create(props: P) {
    props.rows = this.rowProcessor.processRows({
      ...props,
      snap: LAYERS_TO_SNAP.indexOf(props.layerType) >= 0,
    })

    return this.chain(props)
  }
}
