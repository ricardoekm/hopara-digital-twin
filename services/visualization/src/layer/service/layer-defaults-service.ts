import {ArcLayerImpl} from '../domain/ArcLayerImpl.js'
import {AreaLayerImpl} from '../domain/AreaLayerImpl.js'
import {BarLayerImpl} from '../domain/BarLayerImpl.js'
import {CircleLayerImpl} from '../domain/CircleLayerImpl.js'
import {CompositeLayerImpl} from '../domain/CompositeLayerImpl.js'
import {IconLayerImpl} from '../domain/IconLayerImpl.js'
import {ImageLayerImpl} from '../domain/ImageLayerImpl.js'
import {LineLayerImpl} from '../domain/LineLayerImpl.js'
import {ModelLayerImpl} from '../domain/ModelLayerImpl.js'
import {PolygonLayerImpl} from '../domain/PolygonLayerImpl.js'
import {RectangleLayerImpl} from '../domain/RetangleLayerImpl.js'
import {TextLayerImpl} from '../domain/TextLayerImpl.js'
import {CompositeLayer, TemplateLayer} from '../domain/spec/Layer.js'
import {LayerType} from '../domain/spec/LayerType.js'
import LayerImpl from '../domain/LayerImpl.js'
import {fillDefaults} from '../../encoding/domain/DefaultEncodings.js'
import {MapLayerImpl} from '../domain/MapLayerImpl.js'
import {VisualizationType} from '../../visualization/domain/spec/Visualization.js'
import lodash from 'lodash'
import cloneDeep from 'lodash/fp/cloneDeep.js'
import merge from 'lodash/fp/merge.js'
import {TemplateLayerImpl} from '../domain/TemplateLayerImpl.js'

const {mapValues} = lodash

export class LayerDefaultsService {
  static defaults

  static doGetLayerDefaults(): Record<LayerType, LayerImpl> {
    const defaults = {} as Record<LayerType, LayerImpl>

    defaults[LayerType.area] = new AreaLayerImpl({type: LayerType.area})
    defaults[LayerType.arc] = new ArcLayerImpl({type: LayerType.arc})
    defaults[LayerType.bar] = new BarLayerImpl({type: LayerType.bar})
    defaults[LayerType.circle] = new CircleLayerImpl({type: LayerType.circle})
    defaults[LayerType.composite] = new CompositeLayerImpl({type: LayerType.composite} as CompositeLayer)
    defaults[LayerType.icon] = new IconLayerImpl({type: LayerType.icon})
    defaults[LayerType.image] = new ImageLayerImpl({type: LayerType.image})
    defaults[LayerType.line] = new LineLayerImpl({type: LayerType.line})
    defaults[LayerType.model] = new ModelLayerImpl({type: LayerType.model})
    defaults[LayerType.polygon] = new PolygonLayerImpl({type: LayerType.polygon})
    defaults[LayerType.rectangle] = new RectangleLayerImpl({type: LayerType.rectangle})
    defaults[LayerType.text] = new TextLayerImpl({type: LayerType.text})
    defaults[LayerType.map] = new MapLayerImpl({type: LayerType.map})
    defaults[LayerType.template] = new TemplateLayerImpl({type: LayerType.template} as TemplateLayer)

    for (const defaultLayer of Object.values(defaults)) {
      const defaultEncodings = defaultLayer.getDefaultEncodings()
      if (defaultEncodings.length) {
        defaultLayer.encoding = fillDefaults(defaultLayer, defaultLayer.encoding, defaultEncodings)
      }
    }

    return defaults
  }

  static getOverwrites(visualizationType?: VisualizationType): Record<LayerType, any> | undefined {
    if (visualizationType === VisualizationType.CHART) {
      const overwrites = {} as Record<LayerType, any>
      overwrites[LayerType.line] = {
        encoding: {
          line: {
            cap: null,
            segmentLength: null,
          },
          color: {
            value: '#000000',
          },
          size: {
            value: 2,
          },
        },
      }

      overwrites[LayerType.circle] = {
        encoding: {
          size: {
            value: 10,
          },
        },
      }

      return overwrites
    } else if (visualizationType === VisualizationType.WHITEBOARD) {
      const overwrites = {} as Record<LayerType, any>

      overwrites[LayerType.circle] = {
        encoding: {
          size: {
            value: 20,
          },
        },
      }

      return overwrites
    }

    return undefined
  }


  static getLayerDefaults(visualizationType?: VisualizationType): Record<LayerType, LayerImpl> {
    if (!LayerDefaultsService.defaults) {
      LayerDefaultsService.defaults = LayerDefaultsService.doGetLayerDefaults()
    }

    const overwrites = LayerDefaultsService.getOverwrites(visualizationType)
    if (overwrites) {
      return mapValues(LayerDefaultsService.defaults, (layer, layerType) => {
        if (overwrites[layerType]) {
          return merge(cloneDeep(layer), overwrites[layerType])
        }

        return layer
      }) as any
    }

    return LayerDefaultsService.defaults
  }
}
