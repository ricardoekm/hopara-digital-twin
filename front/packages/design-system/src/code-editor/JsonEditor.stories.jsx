import React from 'react'
import {JsonEditor} from './JsonEditor'

export default {
  title: 'Components/Code Editor JSON',
  component: JsonEditor,
}

const Template = (args) => <JsonEditor {...args} />

export const Full = Template.bind({})
Full.args = {
  height: 200,
  value: `[{
    "name": "test",
    "age": 10,
    "alive": true,
    "today": "invalid-date", // comments in json are not allowed
  }]`,
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
        alive: {
          type: 'boolean',
        },
        today: {
          format: 'date-time',
          type: 'string',
        },
      },
    },
  },
}
