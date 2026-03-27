import { LineLayer } from 'deck.gl'
import { BaseViewLayerProps } from './LayerFactory'
import { Rows } from '@hopara/dataset'
import { RowEdit } from './deck/interaction/RowEdit'
import { fromString } from '@hopara/encoding/src/color/Colors'
import { LayerFactoryChain } from './LayerFactoryChain'

const FEEDBACK_ALPHA = 200

export class SnapFeedbackDecorator<P extends BaseViewLayerProps> extends LayerFactoryChain<P> {
  rowEdit?: RowEdit

  constructor(rowEdit?:RowEdit) {
    super()
    this.rowEdit = rowEdit
  }
  
  create(props: P) {
    if (!this.rowEdit?.row) {
      return this.chain(props)
    }

    const snappedRows:Rows = props.rows.filter((row) => row.getCoordinates().isSnapped() && this.rowEdit?.row._id === row._id)
    if (snappedRows.length === 0) {
      return this.chain(props)
    }

    const color = fromString(props.editAccentColor)
    const snapFeedback = new LineLayer(
      {
        id: 'snap-feedback',
        data: snappedRows,
        getSourcePosition: (row:any) => row.getCoordinates().getSnapReference().to2DArray(),
        getTargetPosition: (row:any) => row.getCoordinates().to2DArray(),
        getColor: [color[0], color[1], color[2], FEEDBACK_ALPHA],
        getWidth: 2,
      },
    )

    const layers = this.chain(props)
    layers.push(snapFeedback)
    return layers
  }
}
