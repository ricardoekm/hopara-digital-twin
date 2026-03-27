import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { alertValues, TemplateAnimations, TemplateColors, TemplateSchemas, TemplateSizes } from './base.js'

export const alertingIcon = {
  id: 'alerting-icon',
  name: 'Alerting Icon',
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
        name: 'Ripple',
        type: LayerType.circle,
        encoding: {
          color: {
            field: '{{alert_field}}',
            value: TemplateColors.white,
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                TemplateColors.white,
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
            animation: TemplateAnimations.rippleColor,
          },
          animation: {
            enabled: true,
          },
          size: {
            value: TemplateSizes.rippleSize,
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
      {
        id: '1',
        name: 'Pulse',
        type: LayerType.circle,
        encoding: {
          color: {
            field: '{{alert_field}}',
            value: TemplateColors.white,
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                TemplateColors.white,
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
          },
          animation: {
            enabled: true,
          },
          size: {
            value: TemplateSizes.circleSize,
            animation: TemplateAnimations.pulse,
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
      {
        id: '2',
        name: 'Icon',
        type: LayerType.icon,
        encoding: {
          color: {
            field: '{{alert_field}}',
            scale: {
              type: ColorScaleType.sorted,
              colors: TemplateSchemas.blueBlackWhite,
              values: alertValues,
            },
            value: TemplateColors.blue,
          },
          size: {
            value: TemplateSizes.iconSize,
          },
          icon: {
            value: 'machine',
            field: '{{icon_field}}',
            smartSearch: true,
          },
        },
        highlight: true,
      },
    ],
  }],
}
