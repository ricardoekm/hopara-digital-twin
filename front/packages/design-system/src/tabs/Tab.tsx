import React from 'react'
import {styled} from '../index'
import { Tab as MuiTab } from '@mui/material'

interface Props {
  label: string;
  icon: any;
}

export const Tab = styled((props: Props) => (
  <MuiTab disableRipple {...props} iconPosition="start" sx={{
    gap: 8,
  }}/>
), {name: 'StyledTab'})(({theme}) => ({
  'textTransform': 'none',
  'fontWeight': theme.typography.fontWeightRegular,
  'fontSize': theme.typography.pxToRem(15),
  'marginRight': theme.spacing(1),
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}))
