import React from 'react'

import {CardListItem} from './CardListItem'
import {Icon} from '../icons/Icon'

export default {
    title: 'Organization/Card List/CardListItem',
    component: CardListItem,
}

const Template = (args) => <CardListItem {...args} />

export const Simple = Template.bind({})
Simple.args = {
    name: 'Simple',
    onClick: null,
}

export const LargeTitle = Template.bind({})
LargeTitle.args = {
    name: 'With Very Large Title Longo Grande Big',
    onClick: null,
}

export const BackgroundImage = Template.bind({})
BackgroundImage.args = {
    name: 'Background Image',
    backgroundImage: 'data:image/jpeg;base64,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',
    onClick: null,
}

export const Chip = Template.bind({})
Chip.args = {
    name: 'Chip',
    chip: 'Read Only',
    onClick: null,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
    name: 'WithIcon',
    icon: <Icon icon="query" />,
    onClick: null,
}

export const SizeSmall = Template.bind({})
SizeSmall.args = {
    name: 'Size Small',
    size: 'small',
    onClick: null,
}

export const SizeMedium = Template.bind({})
SizeMedium.args = {
    name: 'Size Medium',
    size: 'medium',
    onClick: null,
}

export const ColorOriginal = Template.bind({})
ColorOriginal.args = {
    name: 'Color Original',
    color: 'original',
    onClick: null,
}

export const CustomColor = Template.bind({})
CustomColor.args = {
    name: 'Custom Color',
    color: '#f3cece',
    onClick: null,
}

export const Loading = Template.bind({})
Loading.args = {
    loading: true,
}

export const Buttons = Template.bind({})
Buttons.args = {
    name: 'Buttons',
    buttons: [{
        disabled: true,
        onClick: () => undefined,
        label: 'I am disabled',
    }, {
        onClick: () => undefined,
        label: 'I am enabled',
        disabled: false,
    }],
    onClick: null,
}

export const Clickable = Template.bind({})
Clickable.args = {
    name: 'Clickable',
    onClick: () => alert('I was clicked!'),
}

export const Flat = Template.bind({})
Flat.args = {
    name: 'Flat',
    flat: true,
    onClick: null,
}
