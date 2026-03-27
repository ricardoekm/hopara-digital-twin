import React from 'react'
import {PanelList, PanelListItem} from './PanelList'
import {Panel} from './Panel'
import {PanelCard} from './PanelCard'

export default {
    title: 'Canvas/Panel',
    component: Panel,
}

const Template = (args) => <Panel>
    <PanelCard title="Card Title" {...args}>
        <PanelList>
            <PanelListItem>oi</PanelListItem>
            <PanelListItem>oi</PanelListItem>
            <PanelListItem>oi</PanelListItem>
            <PanelListItem>oi</PanelListItem>
        </PanelList>
    </PanelCard>
</Panel>

export const Default = Template.bind({})
