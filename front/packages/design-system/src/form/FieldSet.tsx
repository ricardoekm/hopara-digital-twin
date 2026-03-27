import React, {PropsWithChildren} from 'react'
import {Box, Typography} from '@mui/material'
import {useTheme} from '../theme'

export const FieldSet = (props: PropsWithChildren & {legend?: string}) => {
  const theme = useTheme()
  
  return (
    <Box
      component='fieldset'
      sx={{
        'display': 'grid',
        'gridTemplateColumns': 'auto 1fr',
        'rowGap': 8,
        'columnGap': 24,
        'padding': 24,
        'borderRadius': 4,
        'border': `1px solid ${theme.palette.spec.borderColor}`,
        '& .TextFieldWithLabel': {
          gridTemplateColumns: 'subgrid',
          gridColumn: '-1/1',
        },
      }}>
      {props.legend &&
        <Typography component='legend' sx={{fontWeight: 600, textTransform: 'uppercase'}}>{props.legend}</Typography>
      }
      {props.children}
    </Box>
  )
}
