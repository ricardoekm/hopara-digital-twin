import React from 'react'

import {MessagePanel} from './MessagePanel'

export default {
    title: 'Components/Message Panel',
    component: MessagePanel,
}

const Template = (args) => <MessagePanel {...args} />

export const Default = Template.bind({})
Default.args = {
    children: 'This is a message panel',
}

export const LargeText = Template.bind({})
LargeText.args = {
    children: 'This is a bit of a hack, but it\'s the easiest way to get a large error message in the storybook pneumonoultramicroscopicsilicovolcanoconiosis',
}
