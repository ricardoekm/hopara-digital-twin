import React, { PureComponent } from 'react'
import Button from '@mui/material/Button'
import { styled } from '../theme'

interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

const SimpleButtonStyle = styled(Button, { name: 'SimpleButtonStyle' })(({ theme }) => ({
  'textTransform': 'revert',
  'padding': '3px 10px',
  'margin': 0,
  'borderRadius': '50px',
  'width': 'max-content',
  'minWidth': 'revert',
  'color': theme.palette.spec.tabColorForeground,
  'backgroundColor': theme.palette.spec.tabColorBackground,
  'boxShadow': 'none',
  'fontSize': 12.5,
  'fontWeight': 500,
  'transition': 'none',
  '&:hover': {
    color: theme.palette.spec.tabColorForeground,
    backgroundColor: theme.palette.spec.tabColorBackground,
    boxShadow: 'none',
    filter: 'brightness(102%)',
  },
  '&:active': {
    color: theme.palette.spec.tabColorForeground,
    backgroundColor: theme.palette.spec.tabColorBackground,
    boxShadow: 'none',
    transform: 'scale(0.975)',
  },
}))

export class SimpleButton extends PureComponent<Props> {
  render() {
    const { children, onClick, disabled, 'data-testid': testId } = this.props

    return (
      <SimpleButtonStyle
        disableRipple
        size="small"
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
      >
        {children}
      </SimpleButtonStyle>
    )
  }
}

export default SimpleButton
