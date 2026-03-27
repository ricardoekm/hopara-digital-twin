import React, {PropsWithChildren} from 'react'
import {Button, Link, Popover, TooltipProps, Typography} from '@mui/material'
import {Box, SxProps} from '@mui/system'
import {HoparaIconKey, Icon} from '../icons/Icon'
import {useTheme} from '../theme'
import {Tooltip} from '../tooltip/Tooltip'
import {ResourceIcon} from '../icons/ResourceIcon'
import { PanelButton } from '../buttons/PanelButton'

type Props = PropsWithChildren & {
  label?: string | React.ReactElement
  icon?: HoparaIconKey | React.ReactElement
  resourceIcon?: string
  tooltipPlacement: TooltipProps['placement']
  active?: boolean
  selected?: boolean
  popover?: React.ReactNode
  popoverTitle?: string
  popoverPlacement?: TooltipProps['placement']
  onPopoverCloseClick?: () => void
  testId?: string
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  onClick?: (e: any) => void
  tenant?: string
  disabled?: boolean
  hideOnSmallViewport?: boolean
  size?: 'small',
  // TODO: nome melhor para o tipo de botão do modify / transform
  toggleable?: boolean
  LinkComponent?: React.ElementType
  LinkProps?: any
  badge?: boolean
  popoverOpen?: boolean
  popoverHeaderContent?: React.ReactNode
  onPopoverClose?: () => void
  onPopoverOpen?: () => void
}

const CanvasButtonIcon = (props: { icon?: HoparaIconKey, label?: string, resourceIcon?: string, tenant?: string }) => {
  if (props.icon) {
    return <Icon icon={props.icon}/>
  }
  if (props.tenant) {
    return <ResourceIcon icon={props.resourceIcon ?? 'button-pointer'} tenant={props.tenant} fallback="button-pointer"/>
  }
  return null
}

const getButtonOrLink = (props: Props, setAnchorEl: (e: any) => void) => {
  const theme = useTheme()
  const size = props.size === 'small' ? 30 : 32

  const sx: SxProps = {
    'display': 'grid',
    'gridAutoFlow': 'column',
    'placeItems': 'center',
    'borderRadius': '1px',
    'fontSize': 12.5,
    'letterSpacing': -0.125,
    'textTransform': 'unset',
    'border': 'none',
    'color': props.active ? theme.palette.spec.tabColorForeground : theme.palette.spec.foregroundCanvasButton,
    'backgroundColor': props.active ? theme.palette.spec.tabColorBackground : 'none',
    'fontWeight': props.active ? '650' : '550',
    'padding': 4,
    'minWidth': size,
    'minHeight': size,
    'maxWidth': !props.children ? size : 'none',
    'maxHeight': size,
    'cursor': 'pointer',
    'overflow': 'hidden',
    'transition': 'none',
    '& svg': {
      'transition': 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1)',
      'filter': 'drop-shadow(rgba(0,0,0,0.25) 0px 1px 1px)',
      'willChange': 'transform',
      'flexShrink': 0,
    },
    '&:hover': {
      'color': props.toggleable || props.active ? theme.palette.spec.tabColorForeground : theme.palette.spec.foregroundCanvasButtonHover,
      'backgroundColor': props.toggleable || props.active ? theme.palette.spec.tabColorBackground : theme.palette.spec.backgroundCanvasButtonHover,
    },
    '&:active': {
      'color': props.toggleable ? theme.palette.spec.tabColorForeground : theme.palette.spec.foregroundCanvasButtonHover,
      'backgroundColor': props.toggleable ? theme.palette.spec.tabColorBackground : theme.palette.spec.backgroundCanvasButtonHover,
      '& svg': {
        'transform': 'scale(0.9)',
      },
    },

    '&:after': props.selected ? {
      content: '""',
      border: '2px solid',
      position: 'absolute',
      width: '85%',
      height: '85%',
      borderRadius: '50%',
      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))',
      willChange: 'transform',
    } : {},
  }

  const icon = (props.icon && typeof props.icon !== 'string') ? props.icon :
    <CanvasButtonIcon tenant={props.tenant} icon={props.icon} label={props.label?.toString()}
                      resourceIcon={props.resourceIcon}/>

  if (props.href || props.LinkComponent) {
    return (
      <Box component={props.LinkComponent ?? Link} {...props.LinkProps} href={props.href} underline='none' target={props.target} sx={sx} onClick={props.onClick}>
        {icon}
        {props.children}
      </Box>
    )
  }

  return (
    <Button
      disabled={props.disabled}
      disableRipple
      data-testid={props.testId}
      onClick={props.popover ? (e) => {
        props.onPopoverOpen?.()
        setAnchorEl(e.currentTarget)
      } : props.onClick}
      sx={sx}>
      {icon}
      {props.children}
    </Button>
  )
}

export const CanvasNavigationButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const popoverState = Boolean(anchorEl)

  return (
    <>
      <Tooltip
        title={props.label}
        placement={props.tooltipPlacement}
        disableInteractive
      >
        <Box component='span' sx={{
          '@media (max-height: 300px)': {
            display: props.hideOnSmallViewport ? 'none' : 'initial',
          },
          '&:after': props.badge ? {
            content: '""',
            height: 6,
            width: 6,
            position: 'absolute',
            top: 3,
            right: 3,
            backgroundColor: 'primary.main',
            borderRadius: '50%',
          } : {},
        }}>{getButtonOrLink(props, setAnchorEl)}</Box>
      </Tooltip>
      {props.popover &&
        <Popover
          container={() => document.getElementById('visualization-layout') ?? document.body}
          open={popoverState && props.popoverOpen !== false}
          anchorEl={anchorEl}
          transitionDuration={0}
          onClose={() => {
            if (props.onPopoverClose) props.onPopoverClose()
            setAnchorEl(null)
          }}
          sx={{
            'transform': props.popoverPlacement === 'top' ? 'translateY(-8px)' : props.popoverPlacement === 'bottom' ? 'translateY(8px)' : props.popoverPlacement === 'top-start' ? 'translateX(-4px)' : 'translateX(4px)',
            '& .MuiPaper-root': {
              borderRadius: '8px',
              fontSize: 12,
              backgroundColor: (theme: any) => theme.palette.spec.backgroundCanvasButton,
              backdropFilter: (theme: any) => theme.palette.spec.backgroundBlur,
              boxShadow: (theme: any) => theme.palette.spec.shadowCanvasButton,
            },
            '& .MuiMenuItem-root': {
              fontSize: 12,
              paddingInline: 12,
            }
          }}
          anchorOrigin={props.popoverPlacement === 'top' ? {
            vertical: 'top',
            horizontal: 'center',
          } : props.popoverPlacement === 'bottom' ? {
            vertical: 'bottom',
            horizontal: 'center',
          } : props.popoverPlacement === 'top-start' ? {
            vertical: 'top',
            horizontal: 'left',
          } : {
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={props.popoverPlacement === 'top' ? {
            vertical: 'bottom',
            horizontal: 'center',
          } : props.popoverPlacement === 'bottom' ? {
            vertical: 'top',
            horizontal: 'center',
          } : props.popoverPlacement === 'top-start' ? {
            vertical: 'top',
            horizontal: 'right',
          } : {
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{
            display: 'grid',
            gridAutoFlow: 'row',
            backgroundColor: (theme) => theme.palette.background.default,
            backdropFilter: (theme) => theme.palette.spec.backgroundBlur,
          }}>
            {(props.popoverTitle || props.popoverHeaderContent) &&
              <Box sx={{
                backgroundColor: (theme: any) => theme.palette.background.default,
                position: 'sticky',
                top: 0,
                zIndex: 9999,
              }}>
                {props.popoverTitle &&
                  <Box sx={{
                    borderBottom: '1px solid',
                    borderColor: (theme: any) => theme.palette.spec.tableBorder,
                    display: 'grid',
                    alignItems: 'center',
                    gridAutoFlow: 'column',
                    paddingInline: '14px 7px',
                    minHeight: 39,
                  }}>
                    {props.popoverTitle && (
                      <Typography variant='h3' sx={{ color: 'inherit', fontSize: 17, fontWeight: 600 }}>
                        {props.popoverTitle}
                      </Typography>
                    )}
                    <PanelButton
                      sx={{justifySelf: 'flex-end'}}
                      onClick={() => props.onPopoverCloseClick ? props.onPopoverCloseClick() : setAnchorEl(null)}>
                      <Icon icon="color-legend-close"/>
                    </PanelButton>
                  </Box>
                }
                {props.popoverHeaderContent &&
                  <Box sx={{padding: 10, borderBottom: '1px solid', borderColor: (theme: any) => theme.palette.spec.tableBorder}}>
                    {props.popoverHeaderContent}
                  </Box>
                }
              </Box>
            }
            {props.popover}
          </Box>
        </Popover>
      }
    </>
  )
}
