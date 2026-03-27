import { uniqBy } from 'lodash/fp'
import { VegaLayer } from '../VegaLayer'
import { Spec } from 'vega'

export const UNIT_X_FIELD = '_unit_coordinate_x_'
export const UNIT_Y_FIELD = '_unit_coordinate_y_'
export const UNIT_HEIGHT_FIELD = '_unit_size_height_'
export const UNIT_WIDTH_FIELD = '_unit_size_width_'

export class VegaUnitTransform {
  layer: VegaLayer
  indexField = '_index'
  
  constructor(layer: VegaLayer) {
    this.layer = layer
  }

  getTransformedDataName(data: string) {
    return `${data}_transformed_with_unit_positions`
  }
  
  transformMarks(spec: Spec, sourceData?: string): any[] {
    const specLayer = this.getSpecLayer(spec)
    return spec.marks?.map((mark) => {
      if (mark.name && mark.name !== specLayer?.name) return mark

      return {
        ...mark,
        type: 'rect',
        style: undefined,
        from: { data: sourceData ? this.getTransformedDataName(sourceData) : mark.from?.data},
        encode: {
          update: {
            ...mark.encode?.update,
            height: { field: UNIT_HEIGHT_FIELD },
            width: { field: UNIT_WIDTH_FIELD },
            x: { field: UNIT_X_FIELD },
            y: { field: UNIT_Y_FIELD },
            x2: undefined,
            y2: undefined,
            xc: undefined,
          },
        },
      }
    }) ?? []
  }

  getYMaxDomainValue(spec: Spec): number {
    const yColumn = this.layer.data.values?.columns?.get(this.layer.encoding.y.field)
    if (yColumn?.getStats()?.max) return yColumn!.getStats()!.max

    const dataSourceName = this.getSpecLayerData(spec)
    const data = spec.data?.find((d) => d.name === dataSourceName) as any
    const maxValue = data?.values?.reduce((value, row) => {
      return value > row[this.layer.encoding.y.field] ? value : row[this.layer.encoding.y.field]
    }, 0)

    return maxValue || 1000
  }
  
  transformSignals(spec: Spec): any[] {
    const yMaxDomainValue = this.getYMaxDomainValue(spec)

    return [
      ...(spec.signals ?? []),
      {
        name: 'bandwidth_x',
        update: 'bandwidth("x")',
      },
      {
        name: 'maxCount',
        value: yMaxDomainValue,
      },
      {
        name: 'maxCountScaled',
        update: 'height - scale("y", maxCount)',
      },
    ]
  }
  
  transformScales(spec: Spec, sourceData: string): any[] {
    return uniqBy('name', [
      {
        type: 'band',
        name: 'x',
        range: [0, { signal: 'width' }],
        domain: { data: sourceData, field: this.layer.encoding.x.field, sort: false },
        padding: 0.1,
      },
      {
        type: 'linear',
        name: 'y',
        domain: [0, {signal: 'maxCount'}],
        range: [{signal: 'height'}, 0],
        nice: true,
        zero: true,
        reverse: false,
      },
      ...(spec.scales ?? []),
    ])
  }
  
  transformData(spec: Spec, sourceData: string): any[] {
    return [
      ...(spec.data ?? []),
      {
        name: this.getTransformedDataName(sourceData),
        source: sourceData,
        transform: [
          {
            type: 'formula',
            expr: `0 +
            scale('x', datum['${this.layer.encoding.x.field}']) +
            (bandwidth_x) /
            ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))) *
            (
              datum['${this.indexField}'] %
              ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled))))
            )`,
            as: UNIT_X_FIELD,
          },
          {
            type: 'formula',
            expr: `0 +
              scale('y', datum['${this.layer.encoding.y.field}']) +
              height -
              scale('y', datum['${this.layer.encoding.y.field}']) - 
              (
                (
                  (maxCountScaled) /
                  ceil((maxCount) /
                  ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))))
                ) -
                min(0.1 * ((bandwidth_x) / (ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))) - 1)), 1)
              ) -
              floor((datum['${this.indexField}']) / ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled))))) *
              (
                (
                  ((maxCountScaled) / ceil((maxCount) / ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))))) -
                  min(0.1 * ((bandwidth_x) / (ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))) - 1)), 1)
                ) +
                min(0.1 * ((bandwidth_x) / (ceil(sqrt((maxCount) * ((bandwidth_x) / (maxCountScaled)))) - 1)), 1)
              )`,
            as: UNIT_Y_FIELD,
          },
          {
            type: 'formula',
            expr: `(
              (
                maxCountScaled /
                ceil(
                  maxCount /
                  ceil(sqrt(maxCount * (bandwidth_x / maxCountScaled)))
                )
              ) -
              min(
                0.1 * 
                (bandwidth_x / (ceil(sqrt(maxCount * (bandwidth_x / maxCountScaled))) - 1))
              , 1)
            )`,
            as: UNIT_HEIGHT_FIELD,
          },
          {
            type: 'formula',
            expr: `(
              (
                bandwidth_x /
                ceil(sqrt(maxCount * (bandwidth_x / maxCountScaled)))
              ) -
              min(
                0.1 *
                (bandwidth_x / (ceil(sqrt(maxCount * (bandwidth_x / maxCountScaled))) - 1))
              , 1)
            )`,
            as: UNIT_WIDTH_FIELD,
          },
        ],
      },
    ]
  }

  getSpecLayer(spec:Spec) {
    return spec.marks?.find((mark) => (mark.name?.indexOf(this.layer.name.replace(/-/g, '_')) ?? -1) > -1) 
  }

  getSpecLayerData(spec:Spec) {
    const specLayer = this.getSpecLayer(spec)
    return (spec.data?.find((d: any) => d.name === specLayer?.from?.data) as any)?.source ?? specLayer?.from?.data
  }
            
  transform(spec: Spec) {
    const sourceData = this.getSpecLayerData(spec)
    return {
      ...spec,
      data: this.transformData(spec, sourceData),
      marks: this.transformMarks(spec, sourceData),
      scales: this.transformScales(spec, sourceData),
      signals: this.transformSignals(spec),
    }
  }
}

