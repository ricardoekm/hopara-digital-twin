import React from 'react'
import { Dialog as MuiDialog, DialogProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const Dialog = (props: DialogProps & { onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void }) => {
  const theme = useTheme()

  return (
    <MuiDialog
      {...props}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          padding: 32,
          width: 'max-content',
          minWidth: 440,
          [theme.breakpoints.down('sm')]: {
            paddingInline: 16,
            minWidth: 'auto',
            width: 'auto',
            maxWidth: '100%',
          },
        },
      }}
    >
      <form onSubmit={(e) => {
        e.stopPropagation()
        e.preventDefault()
        if (props.onSubmit) props.onSubmit(e)
      }} style={{
        display: 'grid',
        gridAutoFlow: 'row',
        gap: 8,
      }}>
        {props.children}
      </form>
    </MuiDialog>
  )
}
