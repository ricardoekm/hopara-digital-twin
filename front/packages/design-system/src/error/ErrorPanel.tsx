import React from 'react'
import {Typography} from '@mui/material'
import {Theme, useTheme} from '../theme'
import {SxProps} from '@mui/system'

export const ErrorPanel: React.FunctionComponent<{
  error?: string
  testId?: string
  fullWidth?: boolean
  sx?: SxProps<Theme>
}> = ({sx, fullWidth, error, testId}) => {
  const theme = useTheme()

  if (!error) return <></>
  return (
    <Typography
      color="error"
      variant="body2"
      data-testid={testId ?? 'error'}
      sx={{
        padding: 4,
        fontSize: 13,
        color: theme.palette.spec.error,
        ...(fullWidth ? {
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } : {
          width: 'max-content',
          maxWidth: '44ch',
        }),
        wordBreak: 'break-word',
        ...(sx ?? {}) as any,
      }}
    >
      {error}
    </Typography>
  )
}

export const SuccessPanel: React.FunctionComponent<{
  message: string
}> = ({message}) => {
  if (!message) return <></>
  return (
    <Typography color="error" variant="body2" data-testid="error"
                sx={{
                  'padding': '1em',
                  'fontSize': '1em',
                  'color': 'black',
                  'borderRadius': '10px',
                  'backgroundColor': 'rgba(94,255,0,0.25)',
                }}
    >
      {message}
    </Typography>
  )
}

