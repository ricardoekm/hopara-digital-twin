import { Box } from '@mui/material'
import React from 'react'
import {useTheme} from '../theme'

export const PanelMenuScrollButton = React.memo(function ScrollButton(props: {
  area: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const theme = useTheme()
  return (
    <Box sx={{
      gridArea: props.area,
      width: '100%',
      height: '100%',
      backgroundImage: `linear-gradient(to ${props.area}, #00000000 0%, ${theme.palette.background.default} 90%)`,
      display: 'grid',
      placeItems: 'center',
      zIndex: 1,
    }}>
      <button
        {...props}
        onClick={props.onClick}
        style={{
          width: 24,
          height: 24,
          padding: 0,
          border: 'none',
          color: theme.palette.text.primary,
          cursor: 'pointer',
          margin: 'auto',
          lineHeight: 1,
          borderRadius: '100px',
          display: 'grid',
          placeItems: 'center',
          boxShadow: theme.palette.spec.shadowCanvasButton,
          backgroundColor: theme.palette.spec.surfaceVariant,
          backdropFilter: theme.palette.spec.backgroundBlur,
        }}>
        {props.children}
      </button>
    </Box>
  )
})
