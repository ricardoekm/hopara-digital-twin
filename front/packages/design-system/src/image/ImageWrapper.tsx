import React from 'react'
import {Box, SxProps} from '@mui/material'
import {useTheme} from '../theme'
import {PropsWithForwardedRef, withForwardedRef} from '../component/withForwardedRef'
import { omit } from 'lodash/fp'

interface Props extends PropsWithForwardedRef {
  sx?: SxProps
  boxSx?: SxProps
  asThumb?: boolean
  fullWidth?: boolean
}

const ImageWrapperComponent = (props: Props) => {
  const theme = useTheme()
  const safeProps = omit(['asThumb', 'fullWidth', 'boxSx', 'forwardedRef'], props)
  return (
    <Box {...safeProps} ref={props.forwardedRef} sx={{
      boxSizing: 'border-box',
      display: 'grid',
      placeItems: 'center',
      width: props.asThumb ? 80 : '100%',
      minHeight: props.asThumb ? 'auto' : 54,
      maxHeight: props.asThumb ? 'auto' : '40vh',
      ...props.boxSx,
    }}>
      <Box sx={{
        'color': theme.palette.text.primary,
        'backgroundColor': theme.palette.background.default,
        'display': 'grid',
        'placeItems': 'center',
        'boxShadow': theme.palette.spec.shadowCanvasButton,
        'borderRadius': !props.asThumb && !props.fullWidth ? 0 : '2px',
        'overflow': 'hidden',
        'width': props.fullWidth ? '100%' : 'auto',
        'height': 'auto',
        'minWidth': 16,
        'minHeight': props.fullWidth ? 54 : 16,
        'maxHeight': props.asThumb ? 54 : '40vh',
        [theme.breakpoints.down('sm')]: {
          maxHeight: 54,
        },
        ...props.sx,
      }}>{props.children}</Box>
    </Box>
  )
}

export const ImageWrapper = withForwardedRef(ImageWrapperComponent)
