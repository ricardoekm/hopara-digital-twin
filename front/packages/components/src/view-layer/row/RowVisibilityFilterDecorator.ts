import { Condition } from '@hopara/encoding'
import { BaseViewLayerProps } from '../LayerFactory'
import { LayerFactoryChain } from '../LayerFactoryChain'
import { filterVisibleRows } from './RowVisibility'

// Some filtering can be done based on columns from the transform (e.g. neighbor count)
// Also the selection feedback may use a hidden child from a composite layer
// So we have to do it later
export class RowVisibilityFilterDecorator<P extends BaseViewLayerProps> extends LayerFactoryChain<P> {
  create(props: P) {
    if (props.visible?.condition) {
      props.rows = filterVisibleRows(props.rows, props.visible?.condition as Condition)
    }
    
    return this.chain(props)
  }
}
