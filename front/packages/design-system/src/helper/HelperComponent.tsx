import React, { PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { styled } from '../theme'
import { HoparaIconKey, Icon } from '../icons/Icon'
import { i18n } from '@hopara/i18n'
import { SimpleButton } from '../buttons/SimpleButton'

type HelperComponentProps = PropsWithChildren<{
  inline?: boolean
  hasDismissButton?: boolean
  icon?: HoparaIconKey
  iconColor?: string
  onDismiss?: () => void
  className?: string
}>

const HelperWrapper = styled(Box, { name: 'HelperWrapper' })(({ theme }) => ({
  'zIndex': 1,
  'position': 'relative',
  'display': 'grid',
  'gridTemplateColumns': '40px 1fr auto',
  'gridTemplateAreas': '"icon text button"',
  'alignItems': 'center',
  'justifyItems': 'start',
  'gap': '10px',
  'padding': '13px 20px 13px 10px',
  'borderRadius': '4px',
  'fontSize': 13,
  'lineHeight': 1.5,
  'fontWeight': 500,
  'color': theme.palette.spec.foregroundCanvasButton,
  'backgroundColor': theme.palette.spec.backgroundCanvasButton,
  'backdropFilter': theme.palette.spec.backgroundBlur,
  'boxShadow': theme.palette.spec.shadowCanvasButton,

  '&.inline': {
    margin: 0,
    maxWidth: '100%',
    width: '100%',
  },

  '&:not(.inline)': {
    margin: '3px auto',
    maxWidth: 460,
    width: 'fit-content',
  },

  ['@media (max-width: 540px)']: {
    gridTemplateAreas: '"icon" "text" "button"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    textAlign: 'center',
    placeItems: 'center',
  },
}))

const IconWrapper = styled(Box, { name: 'HelperIconWrapper' })({
  gridArea: 'icon',
  width: 24,
  height: 24,
  justifySelf: 'center',
})

const TextWrapper = styled(Box, { name: 'HelperTextWrapper' })({
  gridArea: 'text',
})

const DismissButtonWrapper = styled(SimpleButton, { name: 'HelperDismissButton' })({
  gridArea: 'button',
})

const DismissButton = ({onDismiss}: HelperComponentProps) => {
    return (
      <DismissButtonWrapper onClick={onDismiss}>
        {i18n('GOT_IT')}
      </DismissButtonWrapper>
    )
}

export const HelperComponent = (props: HelperComponentProps) => {
  const { inline, icon, iconColor, hasDismissButton, children, className, ...rest } = props

  return (
    <HelperWrapper
      className={`${inline ? 'inline' : ''} ${className || ''}`.trim()}
      {...rest}
    >
      {!!icon && (
        <IconWrapper sx={{ color: iconColor || 'primary.main' }}>
          <Icon icon={icon} />
        </IconWrapper>
      )}
      <TextWrapper>
        {children}
      </TextWrapper>
      {hasDismissButton && <DismissButton {...props} />}
    </HelperWrapper>
  )
}
