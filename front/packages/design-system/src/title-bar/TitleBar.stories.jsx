import React from 'react'
import {TitleBar} from './TitleBar'
import {Icon} from '../icons/Icon'

export default {
    title: 'Organization/Title Bar',
    component: TitleBar,
}

const Template = (args) => <TitleBar {...args} />

export const JustTitle = Template.bind({})
JustTitle.args = {
    title: 'Title',
    onBack: null,
}

export const WithBack = Template.bind({})
WithBack.args = {
    title: 'With Back',
    onBack: () => alert('I\'m Back'),
}

export const WithSearch = Template.bind({})
WithSearch.args = {
    title: 'With Search',
    hasSearch: true,
    onSearchChange: () => alert('I\'m Searching'),
}

export const WithButtons = Template.bind({})
WithButtons.args = {
    title: 'With Buttons',
    buttons: [{
        label: 'regular-button',
        responsiveIcon: <Icon icon="query" />,
        onClick: () => alert('Button 1 Clicked'),
    }, {
        label: 'primary-button',
        primary: true,
        responsiveIcon: <Icon icon="query" />,
        onClick: () => alert('Button 1 Clicked'),
    }],
}
