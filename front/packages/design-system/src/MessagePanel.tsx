import React from 'react'
import {Typography} from '@mui/material'
import {useTheme} from './theme'

export const MessagePanel: React.FunctionComponent<{
  children: React.ReactNode
  testId?: string
}> = ({children, testId}) => {
  const theme = useTheme()

  return (
  <Typography
    data-testid={testId ?? 'error'}
    sx={{
      padding: '1em',
      fontSize: '1em',
      color: theme.palette.spec.onBackground,
      borderRadius: '10px',
      backgroundColor: theme.palette.spec.background,
      width: 'max-content',
      maxWidth: '44ch',
      boxShadow: '0 2px 4px -1px rgb(0 0 0 / 45%)',
      wordBreak: 'break-word',
    }}
  >
    {children}
  </Typography>
  )
}
