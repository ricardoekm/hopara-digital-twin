import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { alertValues, TemplateAnimations, TemplateColors } from './base.js'

export const alertingDot = {
  id: 'alerting-dot',
  name: 'Alerting Dot',
  form: [{
    path: 'default_color',
    defaultValue: TemplateColors.blue,
    controlType: 'static-color',
  }],
  image: '',
  layers: [{
    type: LayerType.composite,
    id: '{{id#0}}',
    children: [
      {
        id: '0',
        name: 'Dots',
        type: LayerType.circle,
        encoding: {
          color: {
            field: '{{alert_field}}',
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                '{{default_color}}',
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
            value: TemplateColors.blue,
          },
          size: {
            value: 9,
          },
        },
      },
      {
        id: '1',
        name: 'Ripple',
        type: LayerType.circle,
        encoding: {
          color: {
            field: '{{alert_field}}',
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                '{{default_color}}',
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
            value: TemplateColors.blue,
            animation: TemplateAnimations.rippleColor,
          },
          animation: {
            enabled: true,
          },
          size: {
            value: 10,
            animation: TemplateAnimations.rippleSize,
          },
        },
        visible: {
          condition: {
            test: {
              field: '{{alert_field}}',
            },
          },
        },
      },
    ],
  }],
}
