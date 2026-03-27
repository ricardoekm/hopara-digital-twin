import React, { PureComponent } from 'react'
import Button from '@mui/material/Button'
import { styled } from '../theme'

interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  'data-testid'?: string;
  _pillVariant?: 'default' | 'primary';
}

const PanelPillButtonStyle = styled(Button, { name: 'PanelPillButton' })(({ theme }) => ({
  'minWidth': 'auto',
  'width': 'max-content',
  'padding': '2px 12px',
  'margin': 0,
  'borderRadius': '100px',
  'transition': 'none',
  'textTransform': 'none',
  'fontSize': 13,
  'fontWeight': 500,

  'color': theme.palette.text.primary,
  'backgroundImage': theme.palette.spec.backgroundPanelPillButton,
  'boxShadow': theme.palette.spec.shadowPanelPillButton,
  '&:hover': {
    backgroundImage: theme.palette.spec.backgroundPanelPillButtonHover,
  },

  '&.primary': {
    'color': theme.palette.primary.main,
    'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
    'boxShadow': theme.palette.spec.shadowPanelPillButton,
    'fontWeight': 600,
    '&:hover': {
      backgroundImage: theme.palette.spec.backgroundPanelPillButtonPrimaryHover,
    },
  },

  '&.Mui-disabled': {
    'color': theme.palette.text.disabled,
    'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
    'boxShadow': theme.palette.spec.shadowPanelPillButton,
    'opacity': 0.75,
    'pointerEvents': 'none',
  },
}))

export class PanelPillButton extends PureComponent<Props> {
  render() {
    const { children, onClick, disabled, 'data-testid': testId, _pillVariant = 'default' } = this.props

    return (
      <PanelPillButtonStyle
        disableRipple
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
        className={_pillVariant}
      >
        {children}
      </PanelPillButtonStyle>
    )
  }
}
