import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { alertValues, TemplateAnimations, TemplateColors, TemplateSchemas, TemplateSizes } from './base.js'

export const alertingIconAlternative = {
  id: 'alerting-icon-alternative',
  name: 'Alerting Icon Alternative',
  form: [{
    path: 'default_color',
    defaultValue: TemplateColors.green,
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
            value: '{{default_color}}',
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                '{{default_color}}',
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
            value: '{{default_color}}',
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                '{{default_color}}',
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
            animation: {
              ...TemplateAnimations.pulse,
              condition: {
                test: {
                  field: '{{alert_field}}',
                },
              },
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
              colors: TemplateSchemas.whiteBlackWhite,
              values: alertValues,
            },
            value: TemplateColors.white,
          },
          size: {
            value: 21,
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
