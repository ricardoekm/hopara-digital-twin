import React from 'react'
import {styled, useTheme} from '../theme'
import {PureComponent} from '../component/PureComponent'
import {PanelStyle, Props} from './Panel'
import {Box} from '@mui/material'

export const SubPanelStyle = styled(PanelStyle, {name: 'SubPanel'})((props) => ({
  '& .panel-title-bar': {
    'background': 'transparent',
    'backgroundImage': props.theme.palette.spec.backgroundPanelPillButtonPrimary,
    'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
    'zIndex': 1,
  },
}))
export const SubPanelWrapper = styled(Box, {name: 'SubPanelWrapper'})(() => {
  const theme = useTheme()
  return {
    'border': `1px solid ${theme.palette.spec.borderColor}`,
    'marginInline': 7,
    'marginBlockEnd': 7,
    'borderRadius': '8px 8px 2px 2px',
    'overflowY': 'auto',
    'overflowX': 'hidden',
    '&.isCollapsed': {
      borderRadius: 8,
    },
  }
})

export class SubPanel extends PureComponent<Props> {
  render() {
    const {header} = this.props
    return (
      <SubPanelStyle>
        {header}
        {this.props.children}
      </SubPanelStyle>
    )
  }
}
