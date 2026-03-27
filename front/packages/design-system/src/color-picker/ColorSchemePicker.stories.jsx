import React from 'react'

import {ColorScaleType} from '@hopara/encoding'
import {ColorSchemePicker} from './ColorSchemePicker'
import {Logger} from '@hopara/internals'

export default {
  title: 'Components/ColoSchemePicker',
  component: ColorSchemePicker,
}

const Template = (args) => <ColorSchemePicker {...args} />
  
export const Default = Template.bind({})

Default.args = {
  reverse: false,

  onSchemeChange: () => Logger.info('scheme changed'),
  onRangeChange: () => Logger.info('range changed'),
  onReverseChange: () => ({}),

  scheme: undefined,
  scale: ColorScaleType.QUANTILE,
  width: 320,
}

export const WithCustom = Template.bind({})
WithCustom.args = {
  ...Default.args,
  range: ['#ff0000', '#00ff00', '#0000ff'],
}
