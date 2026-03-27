import React from 'react'
import {styled} from '../theme'
import {Box, Skeleton} from '@mui/material'
import {MenuOption, PanelMenuItems} from './PanelMenuItems'
import {PureComponent} from '../component/PureComponent'

interface Props {
  items: MenuOption[]
  onItemClick?: (tab: MenuOption) => void
  loading: boolean
}

const PanelMenuWrapper = styled(Box, {name: 'PanelMenuWrapper'})(({theme}) => ({
  zIndex: 2,
  userSelect: 'none',
  color: 'text.primary',
  padding: 8,
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
    overflowX: 'auto',
    overflowY: 'hidden',
    borderInlineEnd: 'none',
  },
}))

export class PanelMenu extends PureComponent <Props> {
  render() {
    if (this.props.loading) {
      return (
        <PanelMenuWrapper>
          <Box sx={{
            'display': 'grid',
            'gridTemplateColumns': 'repeat(3, 1fr)',
            'gap': 4,
            'width': '100%',
            'minHeight': '58px',
          }}>
            <Skeleton variant="rounded" height="100%"/>
            <Skeleton variant="rounded" height="100%"/>
            <Skeleton variant="rounded" height="100%"/>
          </Box>
        </PanelMenuWrapper>
      )
    }

    if (!this.props.items.length) return null

    return (
      <PanelMenuWrapper>
        <PanelMenuItems
          items={this.props.items}
          onItemClick={this.props.onItemClick}
        />
      </PanelMenuWrapper>
    )
  }
}
