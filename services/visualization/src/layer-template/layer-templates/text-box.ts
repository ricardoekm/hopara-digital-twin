import {LayerType} from '../../layer/domain/spec/LayerType.js'
import {ColorScaleType} from '../../encoding/domain/spec/ColorEncoding.js'
import {alertValues, TemplateColors} from './base.js'

export const textBox = {
  id: 'text-box',
  name: 'Text Box',
  form: [{
    path: 'default_color',
    defaultValue: TemplateColors.white,
    controlType: 'static-color',
  }],
  image: '',
  layers: [
    {
      id: '{{id#0}}',
      type: LayerType.polygon,
      encoding: {
        strokeSize: {
          value: 2,
        },
        strokeColor: {
          value: TemplateColors.black,
        },
        color: {
          field: '{{alert_field}}',
          value: '{{default_color}}',
          opacity: 0.75,
          scale: {
            type: ColorScaleType.sorted,
            colors: [
              '{{default_color}}',
              TemplateColors.yellow,
              TemplateColors.red,
            ],
            values: alertValues,
          },
          animation: {
            channel: {
              duration: 1500,
              repeat: null,
            },
            keyFrames: {
              '0%': {
                opacity: 0.33,
              },
              '50%': {
                opacity: 1,
              },
              '100%': {
                opacity: 0.33,
              },
            },
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
      },
    },
    {
      id: '{{id#1}}',
      type: LayerType.text,
      encoding: {
        text: {
          field: '{{text_field}}',
          maxLength: {
            type: 'AUTO',
          },
        },
        position: {
          type: 'REF',
          data: {
            layerId: '{{id#0}}'
          }
        },
        color: {
          value: TemplateColors.black,
        },
      },
    },
  ],
}
