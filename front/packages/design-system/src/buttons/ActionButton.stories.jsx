import React from 'react'

import {ActionButton} from './ActionButton'

export default {
  title: 'Components/Action Button',
  component: ActionButton,
}

const Template = (args) => <ActionButton {...args} />


export const Default = () => <ActionButton
label="Action Button"
onClick={() => {
  alert('Action Button Clicked')
}
}
/>

export const Tooltip = Template.bind({})
Tooltip.args = {
  label: 'With tooltip',
  tooltip: 'This is a tooltip',
}

export const Loading = Template.bind({})
Loading.args = {
  label: 'Not Loading',
  loadingLabel: 'Loading...',
  status: 'LOADING',
}

export const Loaded = Template.bind({})
Loaded.args = {
  label: 'Not Loading',
  status: 'LOADED',
}

export const NotValid = Template.bind({})
NotValid.args = {
  label: 'Not Valid',
  valid: false,
}

export const Outlined = Template.bind({})
Outlined.args = {
  label: 'Outlined',
  variant: 'outlined',
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Secondary',
  secondary: true,
}
