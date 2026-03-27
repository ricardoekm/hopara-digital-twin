import React from 'react'
import { SxProps, Box } from '@mui/material'
import {Icon} from './icons/Icon'
import {Tooltip} from './tooltip/Tooltip'
import { PureComponent } from './component/PureComponent'

interface HelperButtonProps {
  description: React.ReactNode,
  placement?: any,
  size?: 'small' | 'medium'
  sx?: SxProps
}

export class HelperButton extends PureComponent <HelperButtonProps> {
  render() {
    return <Tooltip
    title={this.props.description}
    placement={this.props.placement}
    componentsProps={{tooltip: {sx: {maxWidth: 320}}}}
    >
    <Box sx={{
        display: 'inline-block',
        lineHeight: '0',
        opacity: 0.4,
        ...this.props.sx,
      }}>
      <Icon icon="help" size={this.props.size === 'medium' ? 'md' : 'sm'} />
    </Box>
    </Tooltip>
  }
}
