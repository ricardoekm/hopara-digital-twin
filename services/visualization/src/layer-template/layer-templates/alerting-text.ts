import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { HoparaAlign } from '../../encoding/domain/spec/TextEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { alertValues, TemplateAnimations, TemplateColors, TemplateSchemas } from './base.js'

export const alertingText = {
  id: 'alerting-text',
  name: 'Alerting Text',
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
        name: 'Background',
        type: LayerType.circle,
        encoding: {
          color: {
            field: '{{alert_field}}',
            scale: {
              type: ColorScaleType.grouped,
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
            condition: {
              test: {
                field: '{{alert_field}}',
              },
            },
          },
          size: {
            value: 30,
            animation: {
              ...TemplateAnimations.pulse,
            },
          },
        },
      },
      {
        id: '1',
        name: 'Text',
        type: LayerType.text,
        encoding: {
          offset: {
            y: {
              value: -1,
            },
          },
          color: {
            field: '{{alert_field}}',
            scale: {
              type: ColorScaleType.grouped,
              colors: TemplateSchemas.whiteBlackWhite,
              values: alertValues,
            },
            value: TemplateColors.white,
          },
          size: {
            value: 16,
          },
          text: {
            field: '{{text_field}}',
            align: HoparaAlign.center,
          },
        },
      },
    ],
  }],
}
