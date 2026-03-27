import { RowTranslator } from '@hopara/dataset'
import { Rowsets } from '../../rowset/Rowsets'
import { ROW_INDEX, ROW_LAYER_ID, ROW_ROWSET_ID } from './RowEnricher'

export class RowsetRowTranslator implements RowTranslator {
  private rowsets:Rowsets
  
  constructor(rowsets:Rowsets) {
    this.rowsets = rowsets
  }

  translate(value: Object) {
    if (!value) {
      return
    }

    const rowset = this.rowsets.getById(value[ROW_ROWSET_ID])
    if (!rowset) {
      return
    }

    return rowset.rows[value[ROW_INDEX]]    
  }

  getSource(value) {
    return {
      rowsetId: value[ROW_ROWSET_ID],
      layerId: value[ROW_LAYER_ID],
    }
  }
}
