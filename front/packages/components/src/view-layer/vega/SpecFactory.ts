import {compile as VegaLiteCompile} from 'vega-lite'
import { VegaLayer } from './VegaLayer'
import { ZoomBehavior, ZoomBehaviorType } from '../../view-state/ViewState'
import { Dimensions } from '@hopara/spatial'
import { VegaUnitTransform } from './transforms/VegaUnitTransform'
import { Spec } from 'vega'
import { AxesDimensions } from '../../chart/domain/AxesDimension'
import { TransformType } from '@hopara/encoding'

const MAX_TICKS = 4000

const getHoparaTransform = (layer: VegaLayer) => {
  if (layer._transform?.type === TransformType.unit) return VegaUnitTransform
  return
}

export interface SpecFactoryProps {
  layers: VegaLayer[]
  dimensions: Dimensions | undefined
  zoomBehavior?: ZoomBehavior
  zoom?: number
  axesDimensions?: AxesDimensions
}

export class SpecFactory {
  getAxisTicksByZoom(axisConfig?: any, zoom = 0, size?: number, zoomBehavior?: ZoomBehaviorType): any {
    const shouldUseZoomableBehavior = axisConfig?.tickCount === undefined && zoomBehavior !== ZoomBehaviorType.FIXED
    const tickCount = Math.ceil(((size || 0) / 140) * Math.pow(2, Math.ceil(zoom)))
    return {
      tickCount: shouldUseZoomableBehavior ?
      tickCount < MAX_TICKS ? tickCount : MAX_TICKS :
      axisConfig?.tickCount,
      labelOverlap: shouldUseZoomableBehavior ?
      tickCount < 30 && Math.ceil(zoom || 1) < 5 :
      axisConfig?.labelOverlap,
      tickRound: shouldUseZoomableBehavior ? false : axisConfig?.tickRound,
      title: null,
      titlePadding: 12,
      titleFontSize: 11,
      labelFontSize: 9,
      labelAngle: 0,
      labelColor: '#8C8C8C',
      tickColor: '#E6E6E6',
      gridColor: '#EEEEEE',
      domainColor: '#E6E6E6',
    }
  }

  getYPadding(mark:string) {
    if (mark === 'bar') {
      return 0
    }

    return 0.1
  }

  getEncodingWithDomains(layer: VegaLayer, baseProps: SpecFactoryProps) {
    const encoding = layer.encoding as any
    return {
      ...encoding,
      x: encoding.x ? {
        ...encoding.x,
        scale: {
          padding: 0.1,
        },
        axis: {
          ...encoding?.x?.axis,
          ...this.getAxisTicksByZoom(
            encoding?.x?.axis,
            baseProps.zoom,
            baseProps.dimensions?.width,
            baseProps.zoomBehavior?.x),
        },
      } : undefined,
      y: encoding.y ? {
        ...encoding.y,
        scale: {
          zero: false,
          padding: this.getYPadding(layer.mark),
        },
        axis: {
          ...encoding?.y?.axis,
          ...this.getAxisTicksByZoom(
            encoding?.y?.axis,
            baseProps.zoom,
            baseProps.dimensions?.height,
            baseProps.zoomBehavior?.y),
            labelBaseline: 'line-bottom',
            labelOffset: 0,
        },
      } : undefined,
    }
  }

  getLayerSpec(layer: VegaLayer, baseProps: SpecFactoryProps): any {
    return {
      ...layer,
      encoding: this.getEncodingWithDomains(layer, baseProps),
    }
  }

  getVegaLiteSpec(props: SpecFactoryProps): any {
    return {
      height: props.dimensions ? props.dimensions.height - (props.axesDimensions?.x.height ?? 0) : undefined,
      width: props.dimensions ? props.dimensions.width - (props.axesDimensions?.y.width ?? 0) : undefined,
      layer: props.layers.map((layerSpec) => this.getLayerSpec(layerSpec, props)),
      config: {legend: {disable: true}, view: {stroke: false}},
    }
  }

  applyTransforms(vegaLiteLayers: any[] = [], compiledSpec: Spec): Spec {
    const transforms = vegaLiteLayers.map((layer) => {
      const transform = getHoparaTransform(layer)
      return transform ? new transform(layer) : undefined
    }).filter((transform) => transform !== undefined)

    return transforms.reduce((spec, transform) => {
      return transform ? transform.transform(spec) : spec
    }, compiledSpec)
  }

  create(props: SpecFactoryProps): Spec {
    const vegaLiteSpec = this.getVegaLiteSpec(props)
    const compiled = VegaLiteCompile(vegaLiteSpec)?.spec
    return this.applyTransforms(vegaLiteSpec.layer, compiled)
  }
}

