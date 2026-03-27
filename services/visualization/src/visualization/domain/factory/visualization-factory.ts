import {LayersFactory} from '../../../layer/domain/factory/layers-factory.js'
import {Visualization} from '../Visualization.js'
import {VisualizationSpec, VisualizationType} from '../spec/Visualization.js'
import {FiltersFactory} from '../../../filter/domain/filters-factory.js'
import slugify from 'slugify'
import {ThreeDLightsFactory} from '../../../lights/3DLightsFactory.js'

const sss = slugify as any


export class VisualizationFactory {
  static fromSpec(spec: VisualizationSpec): Visualization {
    const vizSpec = {
      ...spec,
      id: spec?.id ? sss(spec.id.toString()) : spec.name ? sss(spec.name, {lower: true}) : '',
      layers: LayersFactory.fromSpec(spec?.layers ?? []),
      filters: FiltersFactory.fromSpec(spec?.filters ?? []),
    }

    if (vizSpec.type === VisualizationType.THREE_D) {
      vizSpec.lights = ThreeDLightsFactory.fromSpec(vizSpec?.lights)
    }

    return new Visualization(vizSpec)
  }

  static defaultZoomRange = {
    min: {value: 0},
    max: {value: 25},
  }
}

