import {Visualization} from '../domain/Visualization.js'
import {ColumnsMap} from '../../data/ColumnsMap.js'
import {LayersImpl} from '../../layer/domain/LayersImpl.js'
import {LayerSanitizer} from '../../layer/service/layer-sanitizer.js'

export class VisualizationSanitizer {
  static sanitize(visualization: Visualization, columns: ColumnsMap): Visualization {
    visualization.layers = new LayersImpl(...visualization.layers!.map((layer) => LayerSanitizer.sanitize(layer, columns)))
    return visualization
  }
}
