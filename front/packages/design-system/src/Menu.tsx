import React from 'react'
import {Menu as MuiMenu, MenuProps} from '@mui/material'
import {useTheme} from './theme'
import {Collapse} from '@mui/material'

export function Menu(props: MenuProps) {
  const theme = useTheme()
  return <MuiMenu
    {...props}
    TransitionComponent={Collapse}
    sx={{
      '& .MuiPaper-root': {
        'borderRadius': '6px',
        'backgroundColor': theme.palette.background.default,
        'boxShadow': theme.palette.spec.shadowCanvasButton,
        'backdropFilter': theme.palette.spec.backgroundBlur,
        'transition': 'none',
        'paddingInline': 6,
      },
      '& .MuiMenu-list': {
        'paddingBlock': 6,
      },
      '& .MuiMenuItem-root': {
        'borderRadius': '2px',
        'padding': '6px 8px',
        '& .MuiTouchRipple-root': {
          display: 'none',
        },
        '& .MuiTypography-root': {
          'fontSize': '13px',
        },
      },
    }}
    container={document.getElementById('visualization-layout') ?? document.body}
  >
    {props.children}
  </MuiMenu>
}
