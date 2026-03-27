import {Button, ButtonProps} from '@mui/material'
import React from 'react'
import { PureComponent } from '../component/PureComponent'

interface Props extends ButtonProps {
  children: React.ReactNode;
}

export class ToolbarButton extends PureComponent <Props> {
  render() {
    return <Button
      {...this.props}
      color="primary"
      variant="outlined"
      sx={{
        'borderRadius': 15,
        'fontWeight': 600,
        'letterSpacing': .33,
        'textTransform': 'capitalize',
        'fontSize': 13,
        'border': 'none',
        'backgroundColor': 'primary.light',
        'color': 'primary.main',
        'transition': 'filter 0.25s ease-out',
        'padding': '0 1em',
        'height': '2.5em',
        '&:hover': {
          border: 'none',
          backgroundColor: 'primary.light',
          filter: 'brightness(105%)',
        },
        '& > span': {
          lineHeight: '0',
        },
        '&:disabled': {
          'border': 'none',
        },
      }}
    >
      {this.props.children}
    </Button>
  }
}
