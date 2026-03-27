import { ColorScaleType } from '@hopara/encoding'
import { LayerType } from '../LayerType'
import { TemplateCompiler } from './TemplateCompiler'

export const alertingDotTemplate = {
  id: 'alerting-dot',
  name: 'Alerting Dot',
  form: [{
    path: 'default_color',
    defaultValue: '#2d9cf0',
    controlType: 'static-color'
  },
  {
    path: 'alert_field',
  }],
  image: '',
  layers: [{
    id: '{{id#0}}',
    name: 'Dots',
    type: LayerType.circle,
    encoding: {
      color: {
        field: '{{alert_field}}',
        scale: {
          type: ColorScaleType.SORTED,
          colors: [
            '{{default_color}}',
            '#2d9cf0',
          ],
          values: [1, 2, 3],
        },
        value: '#2d9cf0',
      },
      size: {
        value: 9,
      },
    },
  }],
} as any

test('Compile template', () => {
  const templateCompiler = new TemplateCompiler(undefined as any)
  const form = { alert_field: 'alert', default_color: '#ffffff' }
  const compiledTemplate = templateCompiler.doCompile(alertingDotTemplate.layers[0], alertingDotTemplate.form, form, {}, '1')
  expect(compiledTemplate.encoding.color.field).toEqual('alert')
  expect(compiledTemplate.encoding.color.scale.colors).toEqual(['#ffffff', '#2d9cf0'])
})

test('Compile template removes field if not set', () => {
  const templateCompiler = new TemplateCompiler(undefined as any)
  const form = {}
  const compiledTemplate = templateCompiler.doCompile(alertingDotTemplate.layers[0], alertingDotTemplate.form, form, {}, '1')
  expect(compiledTemplate.encoding.color.field).toBeUndefined()
})

test('Compile template fills ids', () => {
  const templateCompiler = new TemplateCompiler(undefined as any)
  const form = {}
  const compiledTemplate = templateCompiler.doCompile(alertingDotTemplate.layers[0], alertingDotTemplate.form, 
                                                      form, {'{{id#0}}': '10'}, '1')
  expect(compiledTemplate.id).toEqual('10')
})

