import React, { PureComponent } from 'react'
import Button from '@mui/material/Button'
import { styled } from '../theme'
import { SxProps } from '@mui/system'

interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  'data-testid'?: string;
  sx?: SxProps;
  className?: string;
}

const PanelButtonStyle = styled(Button, { name: 'PanelButton' })(({ theme }) => ({
  'minWidth': 'auto',
  'width': 'max-content',
  'padding': 2,
  'margin': 0,
  'color': theme.palette.primary.main,
  'transition': 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.spec.backgroundPanelButtonHover,
  },
  '&:active': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.spec.backgroundPanelButtonActive,
    transform: 'scale(0.9)',
  },
  '&.active': {
    color: theme.palette.spec.tabColorForeground,
    backgroundColor: theme.palette.spec.tabColorBackground,
  },
}))

export class PanelButton extends PureComponent<Props> {
  render() {
      const { children, onClick, disabled, 'data-testid': testId, ...rest } = this.props

    return (
      <PanelButtonStyle
        disableRipple
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
        {...rest}
      >
        {children}
      </PanelButtonStyle>
    )
  }
}
