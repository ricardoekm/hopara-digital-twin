import { ColorScaleType } from '../../encoding/domain/spec/ColorEncoding.js'
import { HoparaAlign } from '../../encoding/domain/spec/TextEncoding.js'
import { LayerType } from '../../layer/domain/spec/LayerType.js'
import { TemplateColors } from './base.js'

export const iconWithBadge = {
  id: 'icon-with-badge',
  name: 'Icon with Badge',
  form: [],
  image: '',
  layers: [{
    type: LayerType.composite,
    id: '{{id#0}}',
    children: [
      {
        'id': '0',
        'name': 'Icon',
        'type': LayerType.icon,
        'encoding': {
          'color': {
            'field': '{{icon_field}}',
            'scale': {
              'type': ColorScaleType.hashed,
              'scheme': 'material700',
            },
            'value': TemplateColors.blue,
          },
          'size': {
            'value': 26,
          },
          'icon': {
            'value': 'machine',
            'field': '{{icon_field}}',
            'smartSearch': true,
          },
        },
      },
      {
        'id': '1',
        'name': 'Badge background',
        'type': LayerType.circle,
        'encoding': {
          'color': {
            'value': TemplateColors.white,
          },
          'strokeColor': {
            'field': '{{icon_field}}',
            'scale': {
              'scheme': 'material700',
              'type': 'hashed',
              'reverse': true
            },
            'opacity': 0.75,
            'value': '#000000'
          },
          'size': {
            'value': 19,
          },
          'strokeSize': {
            'value': 1
          },
          'offset': {
            'x': {
              'value': 10,
            },
            'y': {
              'value': 13,
            },
          },
        },
      },
      {
        'id': '2',
        'name': 'Badge count',
        'type': LayerType.text,
        'encoding': {
          'color': {
            'value': '#1A1A1A',
          },
          'size': {
            'value': 10,
          },
          'text': {
            'field': '{{text_field}}',
            'align': HoparaAlign.center,
          },
          'offset': {
            'x': {
              'value': 10,
            },
            'y': {
              'value': 12,
            },
          },
        },
      },
    ],
  }],
}
