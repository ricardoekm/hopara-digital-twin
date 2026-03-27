import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import {labelToTestId} from '../test/TestTools'
import {Icon} from '../icons/Icon'
import {useTheme} from '../theme'
import { Tooltip } from '../tooltip/Tooltip'


const TooltipWrapper = ({children, text}) => {
  if (!text) return children
  return (
    <Tooltip title={text} placement="top">
      <span>{children}</span>
    </Tooltip>
  )
}

export enum ActionButtonStatus {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  NONE = 'NONE',
}

export interface ActionButtonProps {
  label: string
  tooltip?: string
  loadingLabel?: string
  status?: ActionButtonStatus
  valid?: boolean
  type?: 'submit' | undefined
  variant?: 'outlined' | 'contained'
  onClick?: () => void
  secondary?: boolean
  testId?: string
}

export const ActionButton: React.FunctionComponent<ActionButtonProps> = (props) => {
  const theme = useTheme()
  const {
    label, loadingLabel, status, valid,
    onClick, type, variant, tooltip, testId,
  } = props

  const isLoading = status === ActionButtonStatus.LOADING
  const isLoaded = status === ActionButtonStatus.LOADED
  const localLabel = isLoading ? (loadingLabel ?? label) : label
  const localTestId = testId ?? `${labelToTestId(localLabel)}-button`
  const disabled = valid === false || isLoading

  const buttonContent = isLoaded ? <Icon icon="success-outlined" size="xl"/> : localLabel
  const color = props.secondary ? undefined : 'primary'
  const localVariant = variant ?? (props.secondary ? 'text' : 'contained')
  const sx = props.secondary ? undefined : {
    'minWidth': 'max-content',
    'border': `1px solid ${theme.palette.divider}`,
    'borderRadius': '100px',
    'fontSize': '17px',
    'lineHeight': 1,
    'fontWeight': '600',
    'textTransform': 'none',
    'padding': '10px 16px',
    'whiteSpace': 'pre',
    'boxShadow': '0 1px 2px -1px rgba(0,0,0,0.5), 0 1px 4px -1px rgba(0,0,0,0.5)',
    'transition': 'all 300ms ease-out',
    'backgroundImage': 'linear-gradient(180deg, #6D32E4 0%, #5F28CF 100%)',
    'color': theme.palette.spec.tabColorText,
    '&:after': {
      content: '" ->"',
    },
    '&:hover': {
      filter: 'brightness(110%)',
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.5), 0 1px 4px -1px rgba(0,0,0,0.5)',
    },
    '&:active': {
      transform: 'scale(0.975)',
      boxShadow: '0 1px 2px -1px rgba(0,0,0,0.5), 0 1px 4px -1px rgba(0,0,0,0.5)',
    },
    '&.MuiButton-outlined': {
      color: theme.palette.spec.primary,
      backgroundColor: 'transparent !important',
      backgroundImage: 'none !important',
      border: `1px solid ${theme.palette.spec.primary}`,
      boxShadow: '0 1px 3px -1px rgba(0,0,0,0.8)',
    },
    '&.Mui-disabled': {
      'color': theme.palette.spec.tonal.neutral[60],
      'backgroundImage': 'none !important',
      'border': `1px solid ${theme.palette.divider}`,
      'boxShadow': '0 1px 3px -1px  rgba(0,0,0,0.5)',
    },
    '&.Button-Loading': {
      '&:after': {
        content: '""',
      },
    },

    '&.Button-Loaded': {

      'color': theme.palette.primary.main,
      'background': 'none',
      'border': 'none',
      'boxShadow': 'none',

      '&:after': {
        content: '""',
      },
    },
  }

  return (
    <Box>
      <TooltipWrapper text={tooltip}>
        <Button
          type={type}
          disabled={disabled}
          className={isLoading ? 'Button-Loading' : isLoaded ? 'Button-Loaded' : undefined}
          color={color}
          variant={localVariant}
          onClick={onClick}
          data-testid={localTestId}
          sx={sx}>
          {buttonContent}
        </Button>
      </TooltipWrapper>
    </Box>
  )
}
