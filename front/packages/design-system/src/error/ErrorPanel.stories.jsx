import React from 'react'

import {ErrorPanel} from './ErrorPanel'

export default {
    title: 'Components/Error Panel',
    component: ErrorPanel,
}

const Template = (args) => <ErrorPanel {...args} />

export const Default = Template.bind({})
Default.args = {error: 'Some Error'}

export const LargeText = Template.bind({})


LargeText.args = {error: 'This is a bit of a hack, but it\'s the easiest way to get a large error message in the storybook pneumonoultramicroscopicsilicovolcanoconiosis'}
