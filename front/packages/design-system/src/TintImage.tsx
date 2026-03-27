import {Box, SxProps} from '@mui/material'
import React from 'react'
import {Theme} from './theme'
import { PureComponent } from './component/PureComponent'

interface Props {
  src: string
  tintColor?: string
  sx?: SxProps<Theme>
  size?: number
  height?: number
}

export class TintImage extends PureComponent <Props> {
  render() {
    const size = this.props.size ?? 24
    return <Box sx={{
      ...(this.props.sx as any),
      maskImage: `url("${this.props.src}")`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
    }}>
      <Box
        sx={{
          backgroundColor: this.props.tintColor ?? 'currentColor',
          width: size,
          height: this.props.height ?? size,
        }}
      />
    </Box>
  }
}
