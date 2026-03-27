import React from 'react'

import {CardListSkeleton} from './CardListSkeleton'

export default {
    title: 'Organization/Card List/CardListSkeleton',
    component: CardListSkeleton,
}

const Template = (args) => <CardListSkeleton {...args} />

export const Large = Template.bind({})
Large.args = {
    count: 6,
}

export const Medium = Template.bind({})
Medium.args = {
    count: 6,
    size: 'medium',
}

export const Small = Template.bind({})
Small.args = {
    count: 6,
    size: 'small',
}
