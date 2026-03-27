import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { TemplateColors, TemplateSizes } from './base.js'

export const iconWithBackground = {
  id: 'icon-with-background',
  name: 'Icon with Background',
  form: [{
    path: 'default_color',
    defaultValue: TemplateColors.blue,
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
            value: 'rgba(255, 255, 255, 0.67)',
          },
          size: {
            value: TemplateSizes.circleSize,
          },
        },
      },
      {
        id: '1',
        name: 'Icon',
        type: LayerType.icon,
        encoding: {
          color: {
            value: '{{default_color}}',
          },
          size: {
            value: 21,
          },
          icon: {
            value: '{{static_icon}}',
          },
        },
      },
    ],
  }],
}
