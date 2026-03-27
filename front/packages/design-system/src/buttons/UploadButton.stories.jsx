import React from 'react'

import {UploadButton} from './UploadButton'

export default {
  title: 'Components/Upload Button',
  component: UploadButton,
  argTypes: {
    progress: {
      description: 'percentage progress number of loading state (0-100)',
      type: {name: 'number', required: false},
      control: {type: 'range', min: 0, max: 100, step: 5},
      defaultValue: 0,
    },
    status: {
      description: 'loading style',
      type: {name: 'string', required: false},
      defaultValue: undefined,
      control: {type: 'select', options: ['uploading', 'processing']},
    },
    accept: {
      description: 'input accept values',
      type: {name: 'string', required: true},
      defaultValue: '.png',
    },
  },
}

const Template = (args) => <UploadButton {...args} />

export const Default = Template.bind({})
Default.args = {}
