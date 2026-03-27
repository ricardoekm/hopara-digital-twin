import React from 'react'
import { Typography } from '@mui/material'

interface Props {
  title?: string
  _isThumbImage?: boolean
}

export const DetailsTitle: React.FC<Props> = (props) => {
  return (
    <Typography
      variant="h5"
      sx={{
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        overflowWrap: 'anywhere',
        textAlign: 'left',
        justifySelf: props._isThumbImage ? 'center' : 'start',
        textWrap: 'balance',
        marginBlockStart: props._isThumbImage ? 12 : 0,
      }}
    >
      {props.title}
    </Typography>
  )
}
