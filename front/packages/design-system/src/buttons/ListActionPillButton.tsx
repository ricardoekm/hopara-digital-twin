import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { styled } from '../theme'

interface Props {
  onClick: () => void
  icon?: React.ReactElement
  children: React.ReactNode
  active?: boolean
  testId?: string
  disabled?: boolean
  insideAccordion?: boolean
  className?: string
}

const ListActionPillButtonStyle = styled(Button, { name: 'ListActionPillButton' })(({ theme }) => ({
  'minWidth': 'auto',
  'width': '100%',
  'padding': '8px 24px 8px 12px',
  'margin': '12px auto',
  '&.insideAccordion': {
    'margin': '0 auto 12px auto',
  },
  'borderRadius': '100px',
  'transition': 'none',
  'textTransform': 'none',
  'fontSize': 13,
  'fontWeight': 600,
  'display': 'flex',
  'gap': 2,
  'cursor': 'pointer',
  'height': '35px',
  'color': theme.palette.primary.main,
  'background': 'transparent',
  'backgroundImage': theme.palette.spec.backgroundPanelPillButtonPrimary,
  'boxShadow': theme.palette.spec.shadowPanelPillButton,
  '&:hover': {
    background: 'transparent',
    backgroundImage: theme.palette.spec.backgroundPanelPillButtonPrimaryHover,
    boxShadow: theme.palette.spec.shadowPanelPillButton,
  },
  '&.Mui-disabled': {
    'background': 'transparent',
    'color': theme.palette.spec.tonal.neutral[60],
    'backgroundImage': 'none !important',
    'border': `1px solid ${theme.palette.spec.borderColor}`,
    'boxShadow': '0 1px 3px -1px rgba(0,0,0,0.5)',
  },
}))

export class ListActionPillButton extends React.PureComponent<Props> {
  render() {
    const hasIcon = !!this.props.icon
    const {testId, disabled, insideAccordion, className, ...rest} = this.props

    return (
      <ListActionPillButtonStyle
        {...rest}
        className={`${insideAccordion ? 'insideAccordion' : ''} ${className}`}
        disableRipple
        disabled={disabled}
        data-testid={testId}
      >
        {hasIcon && <Box sx={{transform: 'scale(0.8)', transformOrigin: 'center 25px'}}>{this.props.icon}</Box>}
        <Box>
          {this.props.children}
        </Box>
      </ListActionPillButtonStyle>
    )
  }
}
