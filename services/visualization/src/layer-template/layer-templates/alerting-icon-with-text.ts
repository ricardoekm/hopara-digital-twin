import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { HoparaAlign } from '../../encoding/domain/spec/TextEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { alertValues, TemplateAnimations, TemplateColors, TemplateSchemas, TemplateSizes } from './base.js'

export const alertingIconWithText = {
  id: 'alerting-icon-with-text',
  name: 'Alerting Icon with Text',
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
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                TemplateColors.green,
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
            value: '{{default_color}}',
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
            scale: {
              type: ColorScaleType.sorted,
              colors: [
                '{{default_color}}',
                TemplateColors.yellow,
                TemplateColors.red,
              ],
              values: alertValues,
            },
            value: '{{default_color}}',
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
        name: 'Name',
        type: LayerType.text,
        encoding: {
          color: {
            value: TemplateColors.black,
          },
          size: {
            value: 16,
          },
          text: {
            field: '{{text_field}}',
            align: HoparaAlign.center,
          },
          offset: {
            'x': {value: 0},
            'y': {value: -29},
          },
        },
      },
      {
        id: '3',
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
            value: TemplateSizes.iconSize,
            animation: {
              ...TemplateAnimations.pulse,
            },
          },
          animation: {
            enabled: true,
            condition: {
              test: {
                field: '{{alert_field}}',
              },
            },
          },
          icon: {
            value: '{{static_icon}}',
          },
        },
      },
    ],
  }],
}
