import LayerImpl from '../domain/LayerImpl.js'
import {ColumnsMap} from '../../data/ColumnsMap.js'

export class LayerSanitizer {
  static sanitize(layer: LayerImpl, columns: ColumnsMap): LayerImpl {
    layer.details!.fields = layer.details!.fields?.filter((detailsField) => {
      if (detailsField.value?.encoding?.text?.field) {
        const field = detailsField.value.encoding.text.field
        return field.includes('.') || !!columns.find(layer.getQueryKey()).getColumn(field)
      }
      return true
    })
    return layer
  }
}
