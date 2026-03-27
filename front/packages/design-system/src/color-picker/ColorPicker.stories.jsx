import React from 'react'

import {ColorPicker} from './ColorPicker'
import {Logger} from '@hopara/internals'

export default {
  title: 'Components/ColoPicker',
  component: ColorPicker,
}

const Template = (args) => <ColorPicker {...args} />
  
export const Default = Template.bind({})

Default.args = {}

export const FixedWidth = Template.bind({})

FixedWidth.args = {
  width: 200,
  onChange: (color) => Logger.info(color),
}

export const Small = Template.bind({})

Small.args = {
  width: 150,
}
