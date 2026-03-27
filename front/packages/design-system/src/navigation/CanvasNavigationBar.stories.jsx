import React from 'react'
import {CanvasNavigationBar} from './CanvasNavigationBar'
import {CanvasNavigationButton} from './CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from './CanvasNavigationButtonGroup'
import {CanvasNavigationDivider} from './CanvasNavigationDivider'
import {Box} from '@mui/material'

export default {
    title: 'Canvas/Floating Bar',
    component: CanvasNavigationBar,
}

const RowToolbarTemplate = (args) => <CanvasNavigationBar {...args}>
    <CanvasNavigationButtonGroup className={args.horizontal ? 'horizontal' : ''}>
        <CanvasNavigationButton active label="Transform" icon='polygon-transform-mode' tooltipPlacement={args.tooltipPlacement} />
        <CanvasNavigationButton label="Modify" icon='polygon-modify-mode' tooltipPlacement={args.tooltipPlacement} />
        <CanvasNavigationDivider />
        <CanvasNavigationButton label="Unplace" icon='unplace' tooltipPlacement={args.tooltipPlacement} />
        <CanvasNavigationDivider />
        <CanvasNavigationButton label="Undo" icon='undo' tooltipPlacement={args.tooltipPlacement} />
    </CanvasNavigationButtonGroup>
</CanvasNavigationBar>

const UndoToolbarTemplate = (args) => <CanvasNavigationBar {...args}>
    <CanvasNavigationButtonGroup className={args.horizontal ? 'horizontal' : ''}>
        <CanvasNavigationButton active={false} label="Undo" icon='undo' tooltipPlacement={args.tooltipPlacement}>
            <Box sx={{'paddingInlineEnd': 4}}>Undo</Box>
        </CanvasNavigationButton>
    </CanvasNavigationButtonGroup>
</CanvasNavigationBar>

const NavigationBarTemplate = (args) => <CanvasNavigationBar {...args}>
    <CanvasNavigationButtonGroup>
        <CanvasNavigationButton label="Search" icon='search' tooltipPlacement={args.tooltipPlacement} />
    </CanvasNavigationButtonGroup>
    <CanvasNavigationButtonGroup>
        <CanvasNavigationButton label="Initial Position" icon='initial-position' tooltipPlacement={args.tooltipPlacement} />
    </CanvasNavigationButtonGroup>
    <CanvasNavigationButtonGroup>
        <CanvasNavigationButton label="Zoom In" icon='zoom-in' tooltipPlacement={args.tooltipPlacement} />
        <CanvasNavigationButton label="Zoom Out" icon='zoom-out' tooltipPlacement={args.tooltipPlacement} />
    </CanvasNavigationButtonGroup>
</CanvasNavigationBar>

export const RowToolbar = RowToolbarTemplate.bind({})
RowToolbar.args = {
    horizontal: true,
    tooltipPlacement: 'bottom',
}

export const UndoToolbar = UndoToolbarTemplate.bind({})
UndoToolbar.args = {
    horizontal: true,
    tooltipPlacement: 'bottom',
}

export const NavigationBar = NavigationBarTemplate.bind({})
NavigationBar.args = {
    horizontal: false,
    tooltipPlacement: 'left',
}
