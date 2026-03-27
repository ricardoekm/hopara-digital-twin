import React from 'react'

import {Select} from './Select'
import {AsyncFilterableSelect} from './AsyncFilterableSelect'

export default {
  title: 'Components/AsyncFilterableSelect',
  component: Select,
}
const Template = (args) => {
  const [options, setOptions] = React.useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
  const [value, setValue] = React.useState(args.value)
  return <AsyncFilterableSelect
    options={options}
    value={value}
    onSearch={async (search) => {
      const newOptions = options.filter((option) => option.includes(search))
      setOptions(newOptions)
    }}
    onChange={(value) => {
      setValue(value)
    }}
    {...args}
  />
}

export const Default = Template.bind({})


