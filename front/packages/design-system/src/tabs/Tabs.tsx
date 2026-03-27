import React from 'react'
import {styled} from '../index'
import { Tabs as MuiTabs } from '@mui/material'

interface Props {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const Tabs = styled((props: Props) => (
  <MuiTabs
    {...props}
    TabIndicatorProps={{children: <span className="MuiTabs-indicatorSpan"/>}}
  />
), {name: 'StyledTabs'})(({theme}) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}))
