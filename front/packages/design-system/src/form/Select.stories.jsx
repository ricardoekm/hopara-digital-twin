import React from 'react'

import {Select} from './Select'

export default {
  title: 'Components/Select',
  component: Select,
}
const Template = (args) => <Select {...args} />

export const Default = Template.bind({})

Default.args = {
}

export const StringOptions = Template.bind({})

StringOptions.args = {
  options: [
    'Option 1',
    'Option 2',
    'Option 3',
  ],
}

export const NumberOptions = Template.bind({})

NumberOptions.args = {
  options: [
    1,
    2,
    3,
  ],
}

export const LabelValueOptions = Template.bind({})

LabelValueOptions.args = {
  options: [{label: 'Option 1', value: 1}, {label: 'Option 2', value: 2}, {label: 'Option 3', value: 3}],
}

export const FreeSolo = Template.bind({})

FreeSolo.args = {
  options: ['Option 1', 'Option 2', 'Option 3'],
  freeSolo: true,
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  options: ['Option 1', 'Option 2', 'Option 3'],
}

export const Placeholder = Template.bind({})
Placeholder.args = {
  placeholder: 'Custom Placeholder',
  options: ['Option 1', 'Option 2', 'Option 3'],
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  options: ['Option 1', 'Option 2', 'Option 3'],
}

export const Error = Template.bind({})
Error.args = {
  error: true,
  errorMessage: 'Custom Error Message',
  options: ['Option 1', 'Option 2', 'Option 3'],
}

export const WithNoneValue = Template.bind({})
WithNoneValue.args = {
  options: [{label: 'None'}, {label: 'Option 1', value: 1}, {label: 'Option 2', value: 2}, {label: 'Option 3', value: 3}],
}
